"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export function Spotlight({ className, fill = "white" }: SpotlightProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpacity(1);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "pointer-events-none fixed inset-0 z-30 transition-opacity duration-300",
        className
      )}
      style={{ opacity }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.06), transparent 40%)`,
        }}
      />
    </div>
  );
}
