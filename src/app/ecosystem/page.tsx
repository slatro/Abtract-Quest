"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import {
  ArrowUpRight,
  BadgeCheck,
  Bot,
  Coins,
  Compass,
  Gamepad2,
  Globe,
  Heart,
  Layers3,
  MessageSquare,
  Sparkles,
  Star,
} from "lucide-react";

type Project = {
  id: string;
  name: string;
  description: string;
  category: string;
  websiteUrl: string;
  referralUrl?: string | null;
  twitterUrl?: string | null;
  discordUrl?: string | null;
  telegramUrl?: string | null;
};

const categoryVisuals: Record<
  string,
  {
    icon: typeof Gamepad2;
    hero: string;
    tint: string;
    panel: string;
  }
> = {
  gaming: {
    icon: Gamepad2,
    hero:
      "bg-[radial-gradient(circle_at_18%_20%,rgba(50,118,255,0.32),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(141,76,255,0.28),transparent_24%),linear-gradient(135deg,#111827_0%,#14253f_36%,#0a0d16_100%)]",
    tint: "text-[#dbe8ff]",
    panel: "from-[#7caeff]/35 to-[#ffffff]/12",
  },
  defi: {
    icon: Coins,
    hero:
      "bg-[radial-gradient(circle_at_16%_18%,rgba(255,214,84,0.28),transparent_24%),radial-gradient(circle_at_82%_20%,rgba(41,205,255,0.24),transparent_26%),linear-gradient(135deg,#1d160d_0%,#322611_38%,#0c1014_100%)]",
    tint: "text-[#fff0c2]",
    panel: "from-[#ffd86b]/35 to-[#ffffff]/12",
  },
  social: {
    icon: MessageSquare,
    hero:
      "bg-[radial-gradient(circle_at_18%_20%,rgba(61,255,160,0.3),transparent_26%),radial-gradient(circle_at_84%_18%,rgba(96,200,255,0.2),transparent_24%),linear-gradient(135deg,#0c1814_0%,#123127_38%,#0b0f12_100%)]",
    tint: "text-[#d9ffeb]",
    panel: "from-[#8effc5]/35 to-[#ffffff]/12",
  },
  tooling: {
    icon: Bot,
    hero:
      "bg-[radial-gradient(circle_at_20%_22%,rgba(255,255,255,0.22),transparent_24%),radial-gradient(circle_at_80%_18%,rgba(180,122,255,0.22),transparent_24%),linear-gradient(135deg,#16161c_0%,#242332_38%,#0b0d11_100%)]",
    tint: "text-[#f2e8ff]",
    panel: "from-[#d8bbff]/35 to-[#ffffff]/10",
  },
};

function getProjectVisual(project: Project, index: number) {
  const key = project.category?.trim().toLowerCase();
  const fallback = [
    {
      icon: Globe,
      hero:
        "bg-[radial-gradient(circle_at_16%_18%,rgba(61,255,160,0.24),transparent_24%),radial-gradient(circle_at_80%_18%,rgba(255,255,255,0.16),transparent_22%),linear-gradient(135deg,#121518_0%,#1a2027_38%,#0b0d10_100%)]",
      tint: "text-[#eef4f0]",
      panel: "from-[#d5e1da]/25 to-[#ffffff]/10",
    },
    {
      icon: Layers3,
      hero:
        "bg-[radial-gradient(circle_at_18%_20%,rgba(96,200,255,0.24),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(255,215,0,0.16),transparent_24%),linear-gradient(135deg,#0e131a_0%,#15222f_38%,#0b0d11_100%)]",
      tint: "text-[#e7f6ff]",
      panel: "from-[#a8dbff]/30 to-[#ffffff]/10",
    },
  ][index % 2];

  return categoryVisuals[key] ?? fallback;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function EcosystemPage() {
  const { address } = useAccount();

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["ecosystem"],
    queryFn: async () => {
      const res = await fetch("/api/ecosystem");
      const json = await res.json();
      return json.data ?? [];
    },
  });

  async function handleVisit(project: Project) {
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

  const categoryCount = useMemo(
    () =>
      new Set(
        projects
          .map((project) => project.category?.trim().toLowerCase())
          .filter(Boolean)
      ).size,
    [projects]
  );

  const spotlightCount = useMemo(
    () => projects.filter((project) => project.referralUrl).length,
    [projects]
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <section className="flex flex-col gap-4 rounded-[32px] surface-panel p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full chip-gold px-3 py-1 text-[11px] font-mono uppercase tracking-[0.16em]">
            Spotlight Apps
          </span>
          <span className="inline-flex items-center rounded-full chip-muted px-3 py-1 text-[11px] font-mono uppercase tracking-[0.16em]">
            Abstract ecosystem
          </span>
        </div>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-[#eef4f0] sm:text-[40px]">
              Discover curated apps in a lighter, cleaner browse surface.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#aeb8af] sm:text-base">
              Browse live projects with clearer hierarchy, softer surfaces, and a stronger portal-style card rhythm.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { label: "Projects", value: projects.length, icon: Globe },
              { label: "Categories", value: categoryCount, icon: Compass },
              { label: "Spotlights", value: spotlightCount, icon: Star },
              {
                label: "Wallet mode",
                value: address ? "On" : "Off",
                icon: BadgeCheck,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="inline-flex min-w-[120px] items-center gap-3 rounded-[20px] surface-panel-soft px-4 py-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/[0.04]">
                    <Icon className="h-4 w-4 text-[#dfe7e1]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#eef4f0]">
                      {item.value}
                    </div>
                    <div className="text-[11px] text-[#8e9890]">{item.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="rounded-[30px] surface-panel p-10 text-sm text-[#aeb8af]">
          Loading ecosystem projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-[30px] surface-panel p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl surface-panel-soft">
            <Compass className="h-7 w-7 text-[#dfe7e1]" />
          </div>
          <h2 className="text-xl font-bold text-[#eef4f0]">No projects yet</h2>
          <p className="mt-2 text-sm leading-6 text-[#aeb8af]">
            Add ecosystem projects from admin and they will show up here as
            curated app cards.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => {
            const visual = getProjectVisual(project, index);
            const HeroIcon = visual.icon;
            const spotlight = !!project.referralUrl || index < 3;

            return (
              <article
                key={project.id}
                className={`group relative overflow-hidden rounded-[32px] border border-white/7 ${visual.hero} shadow-[0_18px_40px_rgba(0,0,0,0.18)] transition-transform duration-200 hover:-translate-y-0.5`}
              >
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.18)_52%,rgba(0,0,0,0.36)_100%)]" />

                <div className="relative flex h-[360px] flex-col justify-between p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="inline-flex items-center rounded-full bg-[#ffd86b] px-5 py-2 text-[13px] font-semibold text-[#5a4610] shadow-[0_10px_24px_rgba(255,216,107,0.16)]">
                      <Star className="mr-2 h-4 w-4 fill-current" />
                      {spotlight ? "Spotlight" : "Live"}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-black/40 px-4 py-2 text-[13px] font-semibold text-[#d7ddd8] backdrop-blur-md">
                        {project.referralUrl ? "Referral" : "Website"}
                      </div>
                      <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-[#d7ddd8] backdrop-blur-md">
                        <Heart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="relative flex flex-1 items-center justify-center px-5">
                    <div className="absolute inset-x-0 top-8 text-center">
                      <div className="text-[12px] font-mono uppercase tracking-[0.22em] text-white/45">
                        {project.category || "Project"}
                      </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-20 px-8 text-center">
                      <div
                        className={`text-[46px] font-bold uppercase leading-[0.88] tracking-[-0.03em] ${visual.tint}`}
                      >
                        {project.name}
                      </div>
                    </div>

                    <div className="absolute left-6 top-16 opacity-20">
                      <HeroIcon className={`h-28 w-28 ${visual.tint}`} strokeWidth={1.5} />
                    </div>

                    <div className="absolute right-6 top-20 flex h-28 w-28 items-center justify-center rounded-[28px] border border-white/10 bg-black/18 backdrop-blur-sm">
                      <span className={`text-3xl font-bold ${visual.tint}`}>
                        {getInitials(project.name)}
                      </span>
                    </div>
                  </div>

                  <div className={`relative rounded-[24px] border border-white/8 bg-[linear-gradient(135deg,rgba(255,255,255,0.2),rgba(255,255,255,0.08))] p-[1px]`}>
                    <div className="flex items-center gap-3 rounded-[23px] bg-[#868686]/35 px-4 py-3 backdrop-blur-xl">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-black/60 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                        <HeroIcon className="h-6 w-6" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[15px] font-semibold text-white">
                          {project.name}
                        </div>
                        <div className="mt-1 truncate text-sm text-white/70">
                          {project.category || "Abstract App"}
                        </div>
                      </div>

                      <button
                        onClick={() => handleVisit(project)}
                        className="inline-flex shrink-0 items-center rounded-full bg-[#1f1f23] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#29292f]"
                      >
                        Visit app
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
