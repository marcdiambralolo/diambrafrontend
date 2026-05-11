import { NumberGridGame } from "@/components/NumberGridGame";

export default function GamePage() {
  return (
    <main className="flex flex-1 flex-col items-stretch justify-center py-6 sm:py-10">
      <NumberGridGame />
    </main>
  );
}