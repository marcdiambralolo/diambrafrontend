import { NextRequest, NextResponse } from 'next/server';
import { getBackendApiUrl } from '@/lib/api/server/session';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Token manquant'
                },
                { status: 400 }
            );
        }

        const response = await fetch(`${getBackendApiUrl('payments/verify')}?token=${encodeURIComponent(token)}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
            cache: 'no-store',
            signal: AbortSignal.timeout(300000),
        });

        const data = await response.json().catch(() => null) as Record<string, unknown> | null;
        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    status: 'failed',
                    error: 'Réponse vide du backend de paiement',
                },
                { status: 502 }
            );
        }

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('[MoneyFusion API] Erreur lors de la vérification:', error);
     
        if (error instanceof Error && error.name === 'TimeoutError') {
            return NextResponse.json(
                {
                    success: false,
                    status: 'failed',
                    error: 'Délai dépassé lors de la vérification du paiement',
                },
                { status: 504 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                status: 'failed',
                error: 'Erreur interne du serveur',
            },
            { status: 500 }
        );
    }
}