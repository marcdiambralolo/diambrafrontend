'use client';
import { useProfilUser } from '@/hooks/voyance/useProfilUser';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function MediumInscriptionSuccess({ showButton = true }: { showButton?: boolean }) {
  const router = useRouter();
  const { user } = useProfilUser();

  if (!user) {
    return (
      <main className="max-w-2xl w-full mx-auto flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-lg text-red-600 font-bold">Impossible de charger ton profil.</div>
      </main>
    );
  }

  const {
    id: userId, phone, specialties, domains, presentation, videoLink, ethical, photoUrl,
    posterUrl, specialtyOther, methods, message, idPhotoUrl } = user;

  return (
    <main className="max-w-2xl w-full mt-16 mx-auto flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] rounded-2xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-3xl font-black text-white mb-2 text-center">🎉 Félicitations !</h1>
        <p className="text-lg text-white mb-6 text-center font-semibold">Votre inscription a bien été prise en compte.<br />Bienvenue dans la communauté Mon Étoile !</p>

        <div className="w-full bg-white/90 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-cosmic-indigo mb-4 text-center">Vos informations</h2>
          <div className="flex flex-col items-center gap-4">
            {typeof photoUrl === 'string' && photoUrl && (
              <Image
                src={photoUrl as string}
                alt="Photo de profil"
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover border-4 border-cosmic-indigo shadow"
                priority
              />
            )}
            {typeof posterUrl === 'string' && posterUrl && (
              <Image
                src={posterUrl as string}
                alt="Affiche"
                width={128}
                height={80}
                className="w-32 h-20 object-cover rounded-lg border border-cosmic-indigo"
              />
            )}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <div><span className="font-bold">Téléphone :</span> {typeof phone === 'string' ? phone : ''}</div>
              <div className="sm:col-span-2"><span className="font-bold">Spécialités :</span> {Array.isArray(specialties) ? specialties.join(', ') : (typeof specialties === 'string' ? specialties : '')}</div>
              {typeof specialtyOther === 'string' && specialtyOther && <div className="sm:col-span-2"><span className="font-bold">Autre spécialité :</span> {specialtyOther}</div>}
              <div className="sm:col-span-2"><span className="font-bold">Domaines :</span> {Array.isArray(domains) ? domains.join(', ') : (typeof domains === 'string' ? domains : '')}</div>
              <div className="sm:col-span-2"><span className="font-bold">Méthodes :</span> {Array.isArray(methods) ? methods.join(', ') : (typeof methods === 'string' ? methods : '')}</div>
              <div className="sm:col-span-2"><span className="font-bold">Présentation :</span> {typeof presentation === 'string' ? presentation : ''}</div>
              {typeof message === 'string' && message && <div className="sm:col-span-2"><span className="font-bold">Message d’accueil :</span> {message}</div>}
              {typeof idPhotoUrl === 'string' && idPhotoUrl && <div className="sm:col-span-2"><span className="font-bold">Pièce d'identité :</span> <a href={idPhotoUrl} target="_blank" rel="noopener noreferrer" className="text-cosmic-indigo underline">Voir le document</a></div>}
              <div className="sm:col-span-2"><span className="font-bold">Engagement éthique :</span> {ethical ? 'Oui' : 'Non'}</div>
              {typeof videoLink === 'string' && videoLink && <div className="sm:col-span-2"><span className="font-bold">Vidéo :</span> <a href={videoLink} target="_blank" rel="noopener noreferrer" className="text-cosmic-indigo underline">Voir la vidéo</a></div>}
            </div>
          </div>
        </div>

        {showButton && (
          <button
            className="mt-2 w-full rounded-lg bg-gradient-to-r from-[#4F83D1] to-[#2E5AA6] py-3 font-bold text-white text-lg shadow hover:from-[#3E6FB5] hover:to-[#244A8A] transition"
            onClick={() => router.push(userId ? `/star/abonnement/moneyfusion?userId=${userId}` : '/star/abonnement/moneyfusion')}
          >
            Payer votre abonnement
          </button>
        )}
      </div>
    </main>
  );
}