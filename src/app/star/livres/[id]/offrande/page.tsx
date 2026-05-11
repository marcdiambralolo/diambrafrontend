import BookOfferingPurchasePage from "@/components/livres/id/BookOfferingPurchasePage";

export default async function BookOfferingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (<BookOfferingPurchasePage bookId={id} />);
}