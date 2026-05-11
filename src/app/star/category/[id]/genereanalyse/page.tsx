import CategoryGenereAnalysePageWrapper from "@/components/categorie/genereanalyse/CategoryGenereAnalysePageWrapper";
import { notFound } from "next/navigation";

export default async function CategoryGenereAnalysePage({ params }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string>> }) {
    const { id } = await params;    
    if (!id) return notFound();

    return <CategoryGenereAnalysePageWrapper />;
}
