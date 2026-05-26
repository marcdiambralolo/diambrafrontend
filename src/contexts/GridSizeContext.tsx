// contexts/GridSizeContext.tsx
"use client";

import { createContext, useContext } from "react";

interface GridSizeContextValue {
  cellSize: number;
  fontSize: number;
}

const GridSizeContext = createContext<GridSizeContextValue>({
  cellSize: 100,
  fontSize: 50,
});

export const useGridSize = () => useContext(GridSizeContext);

export const GridSizeProvider = GridSizeContext.Provider;
