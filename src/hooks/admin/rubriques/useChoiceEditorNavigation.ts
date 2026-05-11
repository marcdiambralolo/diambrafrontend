import { useState, useCallback } from "react";

type ChoiceEditorView = "list" | "create";

export function useChoiceEditorNavigation() {
  const [view, setView] = useState<ChoiceEditorView>("list");

  const showList = useCallback(() => setView("list"), []);
  const showCreate = useCallback(() => setView("create"), []);

  return { view, showList, showCreate, };
}