import React from "react";

export type PenguinVariant = "base" | "daily" | "visit" | "social" | "quiz" | "streak" | "hidden" | "visible" | "completed" | "cooldown" | "badge";

export function PenguinIcon({ variant = "base", className = "w-6 h-6" }: { variant?: PenguinVariant, className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      {/* Base Penguin Body */}
      <path d="M12 2C8.5 2 6.5 5.5 6.5 11C6.5 17.5 8 21.5 12 21.5C16 21.5 17.5 17.5 17.5 11C17.5 5.5 15.5 2 12 2Z" fill="currentColor" stroke="none" />
      {/* Belly */}
      <path d="M12 7C9.5 7 8 10 8 14C8 18 10 19.5 12 19.5C14 19.5 16 18 16 14C16 10 14.5 7 12 7Z" fill="white" stroke="none" />
      {/* Eyes */}
      <circle cx="10.5" cy="10" r="1.2" fill="black" stroke="none" />
      <circle cx="13.5" cy="10" r="1.2" fill="black" stroke="none" />
      {/* Beak */}
      <path d="M11 12L12 13.5L13 12Z" fill="#F59E0B" stroke="#F59E0B" />
      {/* Flippers */}
      <path d="M6.5 11.5C4.5 12.5 3 14 3 14" stroke="currentColor" strokeWidth="2" />
      <path d="M17.5 11.5C19.5 12.5 21 14 21 14" stroke="currentColor" strokeWidth="2" />
      {/* Feet */}
      <path d="M9 21.5L8 23H10.5L10 21.5" fill="#F59E0B" stroke="#F59E0B" />
      <path d="M15 21.5L16 23H13.5L14 21.5" fill="#F59E0B" stroke="#F59E0B" />

      {/* Accessories based on variant */}
      {variant === "daily" && (
        <path d="M12 -2V0M18 4L16.5 5.5M22 10H20" stroke="#FCD34D" strokeWidth="2" />
      )}
      {variant === "visit" && (
        <path d="M19 14C20.6569 14 22 15.3431 22 17C22 18.6569 20.6569 20 19 20C17.3431 20 16 18.6569 16 17C16 15.3431 17.3431 14 19 14Z" fill="none" stroke="#60A5FA" />
      )}
      {variant === "social" && (
        <path d="M22 6C22 3.5 19.5 2 17 2C15.5 2 14.5 3 14.5 4L15 6L14 7" stroke="#38BDF8" fill="none" />
      )}
      {variant === "quiz" && (
        <path d="M16 16L19 19V15L16 12V16Z" fill="#A78BFA" stroke="none" />
      )}
      {variant === "streak" && (
        <path d="M18 10C18 10 16 12 16 14C16 15.6569 17.3431 17 19 17C20.6569 17 22 15.6569 22 14C22 11 19 8 19 8C19 8 20 10 20 11C20 10 18 10 18 10Z" fill="#F97316" stroke="none" />
      )}
      {variant === "hidden" && (
        <rect x="7" y="9" width="10" height="3" fill="#1F2937" stroke="none" rx="1" />
      )}
      {variant === "visible" && (
        <circle cx="19" cy="5" r="3" stroke="#EF4444" fill="none" />
      )}
      {variant === "completed" && (
        <path d="M16 16L18 18L22 13" stroke="#22C55E" strokeWidth="2.5" fill="none" />
      )}
      {variant === "cooldown" && (
        <path d="M19 19C20.6569 19 22 17.6569 22 16C22 14.3431 20.6569 13 19 13C17.3431 13 16 14.3431 16 16C16 17.6569 17.3431 19 19 19Z" stroke="#64748B" fill="none" />
      )}
      {variant === "badge" && (
        <path d="M19 12L22 14V18L19 21L16 18V14L19 12Z" fill="#EAB308" stroke="none" />
      )}
    </svg>
  );
}
