'use client';
import { HeaderSection } from './Features';
import ErrorMessage from './ErrorMessage';

const ErrorPage = () => {

  return (
    <div className="w-full mx-auto max-w-md">
      <div className="flex flex-col items-center justify-center mb-8 space-y-4">
        <HeaderSection />
        <ErrorMessage
          type="error"
          title="Erreur de chargement"
          message="Impossible de charger les données du jeu"
          description={"Vérifiez votre connexion et réessayez"}
          onRetry={(() => window.location.reload())}
          onBack={() => window.history.back()}
          showHomeButton={true}
          showRetryButton={true}
          autoRetryCount={3}
          size="md"
        />
      </div>
    </div>
  );
};

export default ErrorPage;