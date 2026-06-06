export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Cute Confused/Waiting Penguin SVG */}
      <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 mb-6 drop-shadow-lg">
        {/* Body */}
        <path d="M12 2C8 2 5 6 5 12v5c0 3 3 5 7 5s7-2 7-5v-5c0-6-3-10-7-10z" />
        {/* Belly */}
        <path d="M8 12c0-3 8-3 8 0v3c0 2-2 3-4 3s-4-1-4-3z" />
        {/* Closed/Sad Eyes */}
        <path d="M8.5 8.5l1.5 -1M14.5 7.5l1.5 1" />
        {/* Beak */}
        <path d="M11 11h2l-1 2z" />
        {/* Shrugging Flippers */}
        <path d="M5 12l-3 -2M19 12l3 -2" />
        {/* Feet */}
        <path d="M9 22l-1 2M15 22l1 2" />
        
        {/* Question marks floating */}
        <path d="M6 3c0-1 1-1.5 2-1s1.5 1 1.5 1.5c0 1-1.5 1.5-1.5 2v1" stroke="#3dffa0" strokeWidth="1.5" className="opacity-60" />
        <circle cx="8" cy="8.5" r="0.5" fill="#3dffa0" stroke="none" className="opacity-60" />
      </svg>

      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-text-2 max-w-sm">{description}</p>
    </div>
  );
}
