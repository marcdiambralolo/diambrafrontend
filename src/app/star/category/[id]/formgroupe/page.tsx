import CategoryFormGroupePageWrapper from "@/components/categorie/formgroupe/CategoryFormGroupePageWrapper";
import { notFound } from "next/navigation";

export default async function CategoryFormGroupePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;        
    if (!id) return notFound();

    return <CategoryFormGroupePageWrapper />;
}
