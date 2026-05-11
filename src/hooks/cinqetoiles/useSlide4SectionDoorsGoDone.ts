"use client";
import { api } from "@/lib/api/client";
import { User } from "@/lib/interfaces";
import { useAuthStore } from "@/lib/store/auth.store";
import { Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

export function useSlide4SectionDoorsGoDone() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const router = useRouter();

  const containerVariants: Variants = useMemo(() => ({
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  }), []);

  const itemVariants:Variants = useMemo(() => ({
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }), []);

  const handleBack = useCallback(() => {
    router.push("/star/profil");
  }, [router]);

  useEffect(() => {
    api.get<User | null>(`/users/me`).then((res) => {
      if (res.data && res.data._id !== user?._id) {
        updateUser(res.data);
      }
    });
  }, [updateUser, user?._id]);

  return { handleBack, containerVariants, itemVariants };
}