import { timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getBackendApiUrl } from '@/lib/api/server/session';

const WEBHOOK_SECRET = process.env.MONEYFUSION_WEBHOOK_SECRET;

type MoneyFusionPayload = {
    token?: string;
    montant?: string | number;
    numeroSend?: string;
    reference?: string;
    statut?: string | boolean;
    code_statut?: string | number;
    data?: {
        token?: string;
        montant?: string | number;
        numeroSend?: string;
        reference?: string;
        statut?: string | boolean;
        code_statut?: string | number;
    };
};

function webhookJson(status: number, payload: Record<string, unknown>) {
    return NextResponse.json(payload, { status });
}

function getProvidedWebhookSecret(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');

    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.slice('Bearer '.length).trim();
    }

    return request.headers.get('x-moneyfusion-secret')
        || request.headers.get('x-webhook-secret')
        || request.headers.get('x-api-key');
}

function hasValidWebhookSecret(request: NextRequest): boolean {
    if (!WEBHOOK_SECRET) {
        return false;
    }

    const providedSecret = getProvidedWebhookSecret(request);
    if (!providedSecret) {
        return false;
    }

    const expected = Buffer.from(WEBHOOK_SECRET);
    const received = Buffer.from(providedSecret);

    if (expected.length !== received.length) {
        return false;
    }

    return timingSafeEqual(expected, received);
}

function normalizePayload(payload: MoneyFusionPayload) {
    const source = payload.data ?? payload;

    return {
        token: source.token ?? payload.token ?? null,
        montant: source.montant ?? payload.montant ?? null,
        numeroSend: source.numeroSend ?? payload.numeroSend ?? null,
        reference: source.reference ?? payload.reference ?? null,
        statut: source.statut ?? payload.statut ?? null,
        codeStatut: source.code_statut ?? payload.code_statut ?? null,
    };
}

function valuesConflict(left: string | number | boolean | null, right: string | number | boolean | null): boolean {
    if (left === null || right === null) {
        return false;
    }

    return String(left) !== String(right);
}

async function verifyPaymentToken(token: string): Promise<MoneyFusionPayload> {
    const response = await fetch(`https://www.pay.moneyfusion.net/paiementNotif/${token}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
        signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
        throw new Error(`MoneyFusion verification failed with status ${response.status}`);
    }

    return response.json() as Promise<MoneyFusionPayload>;
}

async function forwardWebhookToBackend(body: Record<string, unknown>) {
    const response = await fetch(getBackendApiUrl('payments/moneyfusion/webhook'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(body),
        cache: 'no-store',
        signal: AbortSignal.timeout(10000),
    });

    const payload = await response.json().catch(() => null) as Record<string, unknown> | null;
    return { response, payload };
}

export async function POST(request: NextRequest) {
    try {
        if (!WEBHOOK_SECRET) {
            console.error('[MoneyFusion Webhook] MONEYFUSION_WEBHOOK_SECRET is not configured');
            return webhookJson(
                503,
                { success: false, error: 'Webhook non configuré' },
            );
        }

        if (!hasValidWebhookSecret(request)) {
            return webhookJson(
                401,
                { success: false, error: 'Webhook non autorisé' },
            );
        }

        const contentType = request.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            return webhookJson(
                415,
                { success: false, error: 'Content-Type invalide' },
            );
        }

        const body = await request.json() as MoneyFusionPayload & {
            nomclient?: string;
            date_paiement?: string;
            message?: string;
            personal_Info?: Array<Record<string, unknown>>;
        };

        const { token, code_statut, } = body;
        if (!token) {
            console.error('[MoneyFusion Webhook] Token manquant dans la notification');
            return webhookJson(
                400,
                { success: false, error: 'Token manquant' },
            );
        }

        const verifiedPayload = await verifyPaymentToken(token);
        const incomingPayment = normalizePayload(body);
        const verifiedPayment = normalizePayload(verifiedPayload);

        if (valuesConflict(incomingPayment.token, verifiedPayment.token)
            || valuesConflict(incomingPayment.reference, verifiedPayment.reference)
            || valuesConflict(incomingPayment.montant, verifiedPayment.montant)
            || valuesConflict(incomingPayment.numeroSend, verifiedPayment.numeroSend)
            || valuesConflict(code_statut ?? null, verifiedPayment.codeStatut)) {
            return webhookJson(
                409,
                { success: false, error: 'Webhook invalide ou falsifié' },
            );
        }

        const { response: backendResponse, payload } = await forwardWebhookToBackend(body as Record<string, unknown>);

        if (!backendResponse.ok) {
            console.error('[MoneyFusion Webhook] Backend webhook failed:', payload);

            return webhookJson(200, {
                success: false,
                error: 'Traitement backend indisponible',
                message: typeof payload?.message === 'string' ? payload.message : 'Le backend n\'a pas pu traiter le webhook',
            });
        }

        if (Number(verifiedPayment.codeStatut) === 1) {
            return webhookJson(200, payload || {
                success: true,
                message: 'Webhook traité avec succès',
            });
        }

        if (Number(verifiedPayment.codeStatut) === 2) {
            return webhookJson(200, payload || {
                success: true,
                message: 'Paiement déjà traité',
            });
        }

        if (Number(verifiedPayment.codeStatut) === 3) {
            return webhookJson(200, payload || {
                success: true,
                message: 'Paiement en attente',
            });
        }

        return webhookJson(200, payload || {
            success: true,
            message: 'Notification reçue',
        });
    } catch (error) {
        console.error('[MoneyFusion Webhook] Erreur lors du traitement:', error);
        return webhookJson(200, {
            success: false,
            error: 'Erreur interne',
            message: error instanceof Error ? error.message : 'Erreur inconnue',
        });
    }
}

export async function GET() {
    return webhookJson(405, { error: 'Method not allowed' });
}