import { blogService } from "@/lib/api/services/blog.service";
import BlogPostPage from "@/components/blog/id/BlogPostPage";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<import("next").Metadata> {
  const { id } = await params;

  try {
    const post = await blogService.getById(id);
    const description = post.content?.replace(/[#*_`>\-\[\]!\(\)]/g, "").slice(0, 160) || post.title;
    const image = post.illustrationUrl || "/logo.png";

    return {
      title: post.title + " — Mon Étoile",
      description,
      openGraph: {
        title: post.title + " — Mon Étoile",
        description,
        type: "article",
        url: `/star/blog/${id}`,
        images: [
          {
            url: image,
            width: 800,
            height: 600,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title + " — Mon Étoile",
        description,
        images: [image],
      },
    };
  } catch {

    return {
      title: "Article de blog — Mon Étoile",
      description: "Découvrez nos articles de blog sur la guidance, l’astrologie et la spiritualité.",
      openGraph: {
        title: "Article de blog — Mon Étoile",
        description: "Découvrez nos articles de blog sur la guidance, l’astrologie et la spiritualité.",
        type: "article",
        images: [
          {
            url: "/logo.png",
            width: 512,
            height: 512,
            alt: "Logo Mon Étoile",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Article de blog — Mon Étoile",
        description: "Découvrez nos articles de blog sur la guidance, l’astrologie et la spiritualité.",
        images: ["/logo.png"],
      },
    };
  }
}

export default function BlogPostPageWrapper() {
  
  return (<BlogPostPage />);
}
