import CategorySelectionPageWrapper from "@/components/categorie/id/CategorySelectionPageWrapper";
import { notFound } from "next/navigation";

export default async function CategorySelectionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    if (!id) return notFound();

    return <CategorySelectionPageWrapper id={id} />;
}
