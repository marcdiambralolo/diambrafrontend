import CategoryConsulterPageWrapper from "@/components/categorie/consulter/CategoryConsulterPageWrapper";
import { notFound } from "next/navigation";

export default async function CategoryConsulterPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;    
    if (!id) return notFound();

    return <CategoryConsulterPageWrapper />;
}
