import { Metadata } from "next";
import { getConsultantInfoById } from "@/lib/api/services/consultant.service";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const mediumId = params.id;
  
  const consultant = await getConsultantInfoById(mediumId);
  const consultantName = consultant.spiritualName || consultant.fullName || consultant.username || "Consultant Mon Étoile";
  const consultantDesc = consultant.presentation || consultant.bio || "Découvrez la guidance personnalisée de votre consultant Mon Étoile.";
  const consultantPhoto = consultant.photo || consultant.profilePicture || consultant.avatar || null;

  const image = consultantPhoto
    ? (consultantPhoto.startsWith("http") ? consultantPhoto : `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.monetoile.org"}${consultantPhoto}`)
    : `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.monetoile.org"}/og/voyance-message.png`;

  const url = `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.monetoile.org"}/star/voyance/messages/${mediumId}`;
  const title = `Conversation avec ${consultantName} | Mon Étoile`;
  const description = consultantDesc;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `Photo de ${consultantName}`,
        },
      ],
      siteName: "Mon Étoile",
      locale: "fr_FR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      site: "@monetoile_org",
    },
  };
}
