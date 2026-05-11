import { useCallback, useState } from "react";

type ChoiceEditorView = "list" | "create";

export function useChoiceEditorNewNavigation() {
  const [view, setView] = useState<ChoiceEditorView>("create");

  const showList = useCallback(() => setView("list"), []);

  return { view, showList };
}