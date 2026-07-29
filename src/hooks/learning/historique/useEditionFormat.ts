import { formatEditionDate } from "@/lib/functions";
import { Edition } from "@/lib/learning/interface";
import { useMemo } from "react";

export function useEditionFormat(edition?: Edition) {

  return useMemo(() => {
    const editionStartDate = edition?.startDate ? new Date(edition.startDate) : null;
    const editionEndDate = edition?.endDate ? new Date(edition.endDate) : null;

    return {
      edition, formattedStartDate: formatEditionDate(editionStartDate),
      formattedEndDate: formatEditionDate(editionEndDate),
    };
  }, [edition]);
}