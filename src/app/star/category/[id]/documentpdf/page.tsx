import CategoryGenereAnalysePageWrapperPdf from "@/components/categorie/documentpdf/CategoryGenereAnalysePageWrapperPdf";
import { notFound } from "next/navigation";

export default async function CategoryGenereAnalysePage({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;    
    if (!id) return notFound();

    return <CategoryGenereAnalysePageWrapperPdf />;
}
