"use client";

import { Button } from "@/components/ui/button";

export function ResetTutorial({ onReset }: { onReset: () => void }) {
  const handleClick = () => {
    localStorage.removeItem("seenTutorial");
    onReset(); // let parent re-show the tutorial
  };

  return (
    <Button variant="outline" size="sm" onClick={handleClick}>
      Reset Tutorial
    </Button>
  );
}
