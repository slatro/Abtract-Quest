# Abstract Quests

Abstract Quests is a badge-collecting quest app built on Abstract mainnet.

Users can:
- connect with AGW
- complete quests and quizzes
- unlock badge eligibility
- mint ERC-1155 badges
- track collection progress, streaks, and leaderboard rank

## Stack

- Next.js App Router
- TypeScript
- Prisma
- Wagmi
- Viem
- Hardhat
- PostgreSQL-compatible local DB setup

## Main Features

- wallet-based user profiles
- badge gallery with unlock and mint states
- daily check-in and streak logic
- quiz and quest progression
- leaderboard
- ecosystem discovery page
- admin tools for stats, unlocks, and moderation

## Local Development

Run the app:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Project Notes

- badges are one mint per wallet
- unlock state and mint state are tracked separately
- some badge requirements are live, and some are planned / not live yet
- UI assets and badge art live under `public/badge-art` and `public/brand`

## Repository Structure

- `src/app` — pages and API routes
- `src/components` — UI components
- `src/lib` — app logic and helpers
- `prisma` — schema and seed files
- `contracts` — smart contracts
- `public` — static assets
