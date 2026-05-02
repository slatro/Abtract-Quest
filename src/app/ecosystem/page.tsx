"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

export default function EcosystemPage() {
  const { address } = useAccount();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["ecosystem"],
    queryFn: async () => {
      const res = await fetch("/api/ecosystem");
      const json = await res.json();
      return json.data ?? [];
    },
  });

  async function handleVisit(project: any) {
    const res = await fetch("/api/ecosystem/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: project.id,
        wallet: address,
      }),
    });
    const json = await res.json();
    window.open(json.data.url, "_blank");
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Ecosystem</h1>
        <p className="text-sm text-text-2">Discover apps built on Abstract.</p>
      </div>

      {isLoading ? (
        <div className="text-sm text-text-2">Loading...</div>
      ) : projects.length === 0 ? (
        <div className="text-sm text-text-2">No projects yet. Check back soon.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {projects.map((p: any) => (
            <div
              key={p.id}
              className="bg-card border border-border rounded-2xl p-5 hover:border-border-2 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-sm mb-0.5">{p.name}</div>
                  <div className="text-[10px] px-2 py-0.5 rounded bg-bg2 border border-border text-text-3 inline-block">
                    {p.category}
                  </div>
                </div>
              </div>

              <p className="text-xs text-text-2 leading-relaxed mb-4">{p.description}</p>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleVisit(p)}
                  className="px-3 py-1.5 rounded-lg bg-green/10 text-green border border-green/20 text-xs font-semibold hover:bg-green/20 transition-colors"
                >
                  Visit app →
                </button>
                {p.twitterUrl && (
                  <a
                    href={p.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg border border-border text-text-2 text-xs hover:border-border-2 transition-colors"
                  >
                    X / Twitter
                  </a>
                )}
                {p.discordUrl && (
                  <a
                    href={p.discordUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg border border-border text-text-2 text-xs hover:border-border-2 transition-colors"
                  >
                    Discord
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
