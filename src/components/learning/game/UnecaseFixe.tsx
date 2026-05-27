'use client';
import { generateLetterPairs } from "@/lib/learning/functions";
import { Case } from "@/lib/learning/interface";
import { useMemo, memo, useCallback, useEffect, useRef } from "react";
import { colorReference, Theme } from "@/lib/learning/data";
import Image from "next/image";

const UnecaseFixe = memo(({ tpsglobal, txt, isLocked, size, mode, pieces }: Case & { pieces: string[] }) => {
  const letterPairs = generateLetterPairs();
  const caseRef = useRef<HTMLDivElement>(null);

  const updateFontSize = useCallback(() => {
    if (caseRef.current) {
      const newFontSize = `${caseRef.current.clientWidth * 0.5}px`;
      caseRef.current.style.fontSize = newFontSize;
      return newFontSize;
    }
    return "45px";
  }, []);

  const fontSize = useMemo(() => updateFontSize(), [updateFontSize]);
  const txtIndex = useMemo(() => parseInt(txt || "0", 10), [txt]);

  const couleurdefond = useMemo(() => {
    if (tpsglobal === 1) return colorReference[txtIndex] || "black";
    if (isLocked) return Theme.coulfondcaseverouille;
    return "black";
  }, [isLocked, tpsglobal, txtIndex]);

  const imagedefond = useMemo(() => {
    if (tpsglobal !== 2 || !pieces[txtIndex]) return "none";
    return `url(${pieces[txtIndex]})`;
  }, [pieces, tpsglobal, txtIndex]);

  const content = useMemo(() => {
    if (tpsglobal === 0) return txt;
    if (tpsglobal === 3) return letterPairs[txtIndex];

    const size = parseInt(fontSize, 10) || 100;

    const iconProps = {
      priority: true,
      alt: "icon",
      width: size,
      height: size,
      style: { textShadow: "2px 2px 5px rgba(0, 0, 0, 0.8)" },
    };

    switch (tpsglobal) {
      case 1:
        if (mode && isLocked) return <Image src="/momok.png" {...iconProps} alt="OK" />;
        break;
      case 2:
        if (mode && isLocked) return <Image src="/momok.png" {...iconProps} alt="OK" />;
        break;
      default:
        return txt;
    }
  }, [fontSize, isLocked, letterPairs, mode, tpsglobal, txt, txtIndex]);


  useEffect(() => {
    if (!caseRef.current) return;
    const observer = new ResizeObserver(updateFontSize);
    observer.observe(caseRef.current);
    return () => observer.disconnect();
  }, [updateFontSize]);

  return (
    <div ref={caseRef}
      className="text-white font-semibold flex items-center justify-center border border-white cursor-pointer overflow-hidden whitespace-nowrap aspect-square"
      style={{
        width: size,
        height: size,
        backgroundColor: couleurdefond,
        backgroundImage: imagedefond,
      }}
    >
      <span className="overflow-hidden min-w-0">{content}</span>
    </div>
  );
});

UnecaseFixe.displayName = "UnecaseFixe";

export default UnecaseFixe;