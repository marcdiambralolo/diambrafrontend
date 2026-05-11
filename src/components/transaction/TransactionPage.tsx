"use client";
import { PAYMENT_METHODS, useTransactionPage } from "@/hooks/transaction/useTransactionPage";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertCircle, ArrowRight, CheckCircle2, CreditCard, ExternalLink,
    Lock, RefreshCw, Shield, Smartphone
} from "lucide-react";

export default function TransactionPage() {
    const {
        setSelectedPaymentMethod, initiatePayment, handleRetry,
        transaction, isLoading, error, paymentStatus, paymentError, router,
        selectedPaymentMethod, totalAmount, consultationId,
    } = useTransactionPage();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Chargement de votre transaction...</p>
                </div>
            </div>
        );
    }

    if (error || !transaction) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-3">Transaction introuvable</h1>
                    <p className="text-gray-600 mb-8">
                        {error || "Impossible de récupérer les détails de votre transaction."}
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
                    >
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-2xl mx-auto px-4 py-12">
                <AnimatePresence mode="wait">
                    {paymentStatus === "success" && (
                        <motion.div
                            key="success"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="mb-8 text-center"
                        >
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-12 h-12 text-green-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-3">
                                Paiement confirmé !
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Merci pour votre confiance. Votre transaction a été enregistrée.
                            </p>
                        </motion.div>
                    )}

                    {/* États de paiement en cours */}
                    {(paymentStatus === "initiating" || paymentStatus === "pending_user_action" || paymentStatus === "verifying") && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-8 text-center"
                        >
                            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                {paymentStatus === "initiating" && (
                                    <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin" />
                                )}
                                {(paymentStatus === "pending_user_action" || paymentStatus === "verifying") && (
                                    <Lock className="w-12 h-12 text-indigo-600" />
                                )}
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                {paymentStatus === "initiating" && "Préparation du paiement..."}
                                {paymentStatus === "pending_user_action" && "Redirection vers la page sécurisée"}
                                {paymentStatus === "verifying" && "Vérification en cours..."}
                            </h2>
                            <p className="text-gray-500">
                                {paymentStatus === "pending_user_action" && "Vous allez être redirigé dans quelques instants"}
                                {paymentStatus === "verifying" && "Nous vérifions le statut de votre transaction"}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Détails de la transaction */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden mb-6"
                >
                    <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Récapitulatif de la commande
                        </h2>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                            <span className="text-gray-600">Montant total</span>
                            <span className="text-2xl font-bold text-indigo-600">
                                {totalAmount.toLocaleString()} FCFA
                            </span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Client</span>
                                <span className="font-medium text-gray-800">
                                    {transaction.nomclient || transaction.nom}
                                </span>
                            </div>

                            {(transaction.numeroSend || transaction.phone) && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Téléphone</span>
                                    <span className="font-mono text-sm text-gray-700">
                                        {transaction.numeroSend || transaction.phone}
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Référence</span>
                                <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {transaction.transactionId}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Date</span>
                                <span className="text-gray-600">
                                    {new Date(transaction.createdAt).toLocaleString("fr-FR", {
                                        dateStyle: "long",
                                        timeStyle: "short",
                                    })}
                                </span>
                            </div>
                        </div>

                        {transaction.items.length > 0 && (
                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="font-medium text-gray-700 mb-3">Articles commandés</h3>
                                <ul className="space-y-2">
                                    {transaction.items.map((item, idx) => (
                                        <li key={idx} className="flex justify-between text-sm py-1">
                                            <span className="text-gray-600">
                                                {item.name} × {item.quantity}
                                            </span>
                                            <span className="text-gray-700 font-medium">
                                                {item.totalPrice.toLocaleString()} FCFA
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Sélection du moyen de paiement */}
                {paymentStatus === "idle" && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden mb-6"
                    >
                        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                                <Smartphone className="w-5 h-5" />
                                Choisissez votre moyen de paiement
                            </h2>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-3">
                                {PAYMENT_METHODS.map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setSelectedPaymentMethod(method.id)}
                                        className={`
                      relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all
                      ${selectedPaymentMethod === method.id
                                                ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                            }
                    `}
                                    >
                                        <span className="text-2xl">{method.icon}</span>
                                        <span className="text-sm font-medium text-gray-700">
                                            {method.name}
                                        </span>
                                        {selectedPaymentMethod === method.id && (
                                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                                                <CheckCircle2 className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                                <Shield className="w-3 h-3" />
                                <span>Paiement 100% sécurisé par Money Fusion</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Bouton d'action ou message d'erreur */}
                {paymentStatus === "idle" && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <button
                            onClick={initiatePayment}
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 transition shadow-md flex items-center justify-center gap-2"
                        >
                            Payer {totalAmount.toLocaleString()} FCFA
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <p className="text-xs text-gray-400 text-center mt-4">
                            En cliquant sur "Payer", vous serez redirigé vers une page de paiement sécurisée.
                            Aucune information bancaire n'est stockée sur notre plateforme.
                        </p>
                    </motion.div>
                )}

                {/* Message d'erreur avec action de réessai */}
                {paymentStatus === "error" && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
                    >
                        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                        <h3 className="font-semibold text-red-800 mb-2">Une erreur est survenue</h3>
                        <p className="text-red-600 text-sm mb-4">{paymentError}</p>
                        <button
                            onClick={handleRetry}
                            className="px-5 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center gap-2 mx-auto"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Réessayer le paiement
                        </button>
                    </motion.div>
                )}

                {/* Lien vers la consultation (succès) */}
                {paymentStatus === "success" && consultationId && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => router.push(`/consultations/${consultationId}`)}
                            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition font-medium"
                        >
                            Voir ma consultation
                            <ExternalLink className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Footer help */}
                <div className="mt-12 text-center text-sm text-gray-400 border-t border-gray-100 pt-6">
                    <p>
                        Une confirmation vous sera envoyée par email.<br />
                        En cas de problème, contactez notre{" "}
                        <button className="text-indigo-500 hover:text-indigo-600 underline">
                            support client
                        </button>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}