"use client";
import DiambraWrapper from "@/components/learning/DiambraWrapper";
import MenuDiambra from "@/components/learning/MenuDiambra";
import { useCommon } from "@/hooks/learning/useCommon";

export default function Principale() {
  const { randomImage, onlineStatus } = useCommon();

  return (
    <DiambraWrapper
      titre="DIAMBRA LEARNING"
      randomImage={randomImage}
      onlineStatus={onlineStatus}
    >
      <MenuDiambra />
    </DiambraWrapper>
  );
}