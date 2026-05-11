import { useMemo } from "react";

export function useAdminBookNewPageMeta() {
    const backUrl = useMemo(() => {
        return `/admin/books?cb=${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
    }, []);

    const breadcrumbs = useMemo(() => [
        { label: "Admin", href: "/admin" },
        { label: "Livres", href: "/admin/books" },
        { label: "Nouveau", current: true },
    ], []);

    return { backUrl, breadcrumbs };
}