import type { OfferingAlternative, WalletOffering } from "@/lib/interfaces";
import { useCallback, useMemo, useState } from "react";

export type Category = 'animal' | 'vegetal' | 'beverage';

export function useOfferingStepState(requiredOfferings: OfferingAlternative[], walletOfferings: WalletOffering[], onNext: (selected: OfferingAlternative) => void) {
 
   const [activeTab, setActiveTab] = useState<Category>('animal');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const walletMap = useMemo(() => {
    const map = new Map<string, number>();
    walletOfferings.forEach(w => map.set(w.offeringId, w.quantity));
    return map;
  }, [walletOfferings]);

  const offeringsByCategory = useMemo(() => {
    const grouped: Record<Category, OfferingAlternative[]> = {
      animal: [],
      vegetal: [],
      beverage: []
    };
    requiredOfferings.forEach(off => {
      grouped[off.category].push(off);
    });
    return grouped;
  }, [requiredOfferings]);

  const categoryCounts = useMemo(() => ({
    animal: offeringsByCategory.animal.length,
    vegetal: offeringsByCategory.vegetal.length,
    beverage: offeringsByCategory.beverage.length
  }), [offeringsByCategory]);

  const selectedOffering = useMemo(
    () => requiredOfferings.find(off => off.offeringId === selectedId),
    [requiredOfferings, selectedId]
  );

  const availableQty = useMemo(
    () => selectedOffering ? (walletMap.get(selectedOffering.offeringId) || 0) : 0,
    [selectedOffering, walletMap]
  );

  const canProceed = useMemo(
    () => !!selectedOffering && availableQty >= selectedOffering.quantity,
    [selectedOffering, availableQty]
  );

  const handleTabChange = useCallback((category: Category) => {
    setActiveTab(category);
  }, []);

  const handleSelect = useCallback((offeringId: string) => {
    setSelectedId(offeringId);
  }, []);

  const handleNext = useCallback(() => {
    if (selectedOffering && canProceed) {
      onNext(selectedOffering);
    }
  }, [selectedOffering, canProceed, onNext]);

  const currentOfferings = offeringsByCategory[activeTab as Category];

  return {
    handleTabChange, setSelectedId, handleSelect, setActiveTab, handleNext,
    selectedId, activeTab, walletMap, offeringsByCategory, categoryCounts,
    selectedOffering, availableQty, canProceed, currentOfferings,
  };
}