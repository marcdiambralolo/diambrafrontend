import VoyanceThreadPageClient from "@/components/voyance/messages/VoyanceThreadPageClient";

type PageParams = { id: string };

export default async function Page({ params, }: { params: Promise<PageParams>; }) {
    const [{ id }] = await Promise.all([params,]);

    return <VoyanceThreadPageClient mediumId={id} />;
}
