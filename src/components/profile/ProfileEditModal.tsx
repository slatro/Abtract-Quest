import { useState, useEffect } from "react";
import { User } from "@/types";

interface ProfileEditModalProps {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

const AVATARS = [
  "ninja",
  "king",
  "samurai",
  "doctor",
  "astronaut",
  "cyberpunk",
  "wizard",
  "pirate",
  "chef",
  "detective",
  "pilot",
  "explorer",
];

export function ProfileEditModal({ user, onClose, onSuccess }: ProfileEditModalProps) {
  const [username, setUsername] = useState(user.username || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Disable background scroll
    document.body.style.overflow = "hidden";
    return () => {
      // Re-enable background scroll
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: user.wallet,
          username: username.trim() || undefined,
          avatar: avatar || undefined,
        }),
      });
      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-md border border-white/10 bg-[#0f1115] shadow-2xl">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Edit Profile</h2>
            <button onClick={onClose} className="p-1 text-white/50 hover:text-white transition-colors">
              ✕
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-white/80 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Collector"
              className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-green/50 transition-colors"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-white/80 mb-2">Choose Avatar</label>
            <div className="grid grid-cols-4 gap-3">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                    avatar === a ? "border-green scale-105 shadow-[0_0_15px_rgba(34,197,94,0.3)]" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/avatars/${a}.png`} alt={a} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full rounded-md bg-green px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-green/90 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
