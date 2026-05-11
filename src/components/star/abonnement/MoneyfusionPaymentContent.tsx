'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const PRICES = [
    { label: 'Mensuel', value: 'monthly', months: 1, price: 100000 },
    { label: 'Trimestriel', value: 'quarterly', months: 3, price: 300000 },
    { label: 'Semestriel', value: 'semiannual', months: 6, price: 600000 },
    { label: 'Annuel', value: 'annual', months: 12, price: 1200000 },
];

export default function MoneyfusionPaymentContent() {
    const router = useRouter();
    
    const [selected, setSelected] = useState(PRICES[0].value);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePay = async () => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            setLoading(false);
            router.push(`/star/monprofil`);
        }, 2000);
    };

    const current = PRICES.find(p => p.value === selected)!;

    return (
        <div className="max-w-lg mt-16 w-full mx-auto flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-full bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] rounded-2xl shadow-lg p-8 flex flex-col items-center">
                <h1 className="text-2xl font-black text-white mb-2 text-center">Paiement de l'abonnement</h1>
                <p className="text-white mb-6 text-center">Choisissez la durée de votre abonnement consultant. <br />Tarif : <span className="font-bold">100 000 FCFA / mois</span></p>
              
                <form className="w-full flex flex-col gap-4 mb-4" onSubmit={e => { e.preventDefault(); handlePay(); }}>
                    {PRICES.map(option => (
                        <label key={option.value} className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition ${selected === option.value ? 'border-cosmic-indigo bg-white/90 font-bold' : 'border-zinc-200 bg-white/60'}`}>
                            <input
                                type="radio"
                                name="plan"
                                value={option.value}
                                checked={selected === option.value}
                                onChange={() => setSelected(option.value)}
                                className="accent-cosmic-indigo"
                            />
                            {option.label} ({option.months} mois) — <span className="text-cosmic-indigo font-bold">{option.price.toLocaleString()} FCFA</span>
                        </label>
                    ))}                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-gradient-to-r from-[#4F83D1] to-[#2E5AA6] py-3 font-bold text-white text-lg shadow hover:from-[#3E6FB5] hover:to-[#244A8A] transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Paiement en cours...' : `Payer ${current.price.toLocaleString()} FCFA`}
                    </button>
                </form>

                {error && <div className="text-red-600 font-bold mt-2">{error}</div>}
                <p className="text-xs text-white/80 text-center mt-2">Le paiement est sécurisé via MoneyFusion. Vous serez redirigé vers vos messages après validation.</p>
            </div>
        </div>
    );
}