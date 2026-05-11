import { useMemo } from "react";
import type { OfferingAlternative, Offering } from "@/lib/interfaces";
import type { Book } from "@/lib/interfaces";

export function useBookPreview(book: Partial<Book>, offerings?: Offering[]) {
  return useMemo(() => {
    const title = book?.title?.trim() || "";
    const subtitle = book?.subtitle?.trim() || "";
    const author = book?.author?.trim() || "";
    const category = book?.category?.trim() || "";
    const description = book?.description?.trim() || "";
    const coverImage = book?.coverImage?.trim() || "";
    const isActive = book?.isActive !== false;
    const pages = typeof book?.pages === 'number' ? `${book.pages} pages` : "";
    const price = book?.price !== undefined && book.price !== "" ? `${Number(book.price).toLocaleString("fr-FR")} FCFA` : "";
    const isEmpty = !title && !author && !description && !coverImage;

    let offeringAlternatives: OfferingAlternative[] = book.offeringAlternatives || [];
    const offeringList: Offering[] = offerings || [];

    if (offeringList.length > 0 && offeringAlternatives.length > 0) {
      offeringAlternatives = offeringAlternatives.map((alt: OfferingAlternative) => {
        const found = offeringList.find((o) => o._id === alt.offeringId || o.offeringId === alt.offeringId);
        return found
          ? { ...alt, name: found.name, description: found.description, price: found.price, priceUSD: found.priceUSD }
          : alt;
      });
    }

    return {
      title,
      subtitle,
      author,
      category,
      description,
      coverImage,
      isActive,
      pages,
      price,
      isEmpty,
      offeringAlternatives,
    };
  }, [book, offerings]);
}