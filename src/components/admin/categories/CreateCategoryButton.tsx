"use client";
import React from "react";
import { Plus } from "lucide-react";

export default function CreateCategoryButton() {

  return (
    <div className="mb-4 flex justify-end">
      <a
        href={`/admin/categories/create?r=${Date.now()}`}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-[#254A8B] hover:to-[#3F73BE]"
      >
        <Plus className="h-4 w-4" />        Nouvelle catégorie
      </a>
    </div>
  );
}