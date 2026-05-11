import CategoryFormPageWrapper from "@/components/categorie/form/CategoryFormPageWrapper";
import { notFound } from "next/navigation";

export default async function CategoryFormPage({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;           
    if (!id) return notFound();

    return <CategoryFormPageWrapper />;
}
