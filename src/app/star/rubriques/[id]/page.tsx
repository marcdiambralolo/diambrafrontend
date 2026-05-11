import RubriqueRedirectClient from '@/components/rubrique/RubriqueRedirectClient';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function RubriquePage({ params }: PageProps) {
    const { id } = await params;  
      
    return <RubriqueRedirectClient id={id} />;
}
