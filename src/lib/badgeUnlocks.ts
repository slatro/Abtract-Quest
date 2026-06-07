import { db } from "@/lib/db";
import type { Badge, Prisma, UnlockSource } from "@prisma/client";

type UserWithProgress = Prisma.UserGetPayload<{
  include: {
    mintRecords: { select: { badgeId: true } };
    badgeUnlocks: { select: { badgeId: true } };
    questCompletions: {
      include: {
        quest: { select: { badgeId: true } };
      };
    };
    quizAttempts: {
      where: { passed: true };
      include: {
        quiz: { select: { badgeId: true } };
      };
    };
  };
}>;

export async function persistBadgeUnlock(
  userId: string,
  badgeId: number,
  source: UnlockSource,
  sourceRef?: string
) {
  return db.badgeUnlock.upsert({
    where: {
      userId_badgeId: {
        userId,
        badgeId,
      },
    },
    update: {
      source,
      sourceRef: sourceRef ?? null,
    },
    create: {
      userId,
      badgeId,
      source,
      sourceRef: sourceRef ?? null,
    },
  });
}

export function getUnlockedBadgeIds(user: UserWithProgress, badges: Badge[]) {
  const ownedIds = new Set(user.mintRecords.map((record) => record.badgeId));
  const unlockedIds = new Set<number>(user.badgeUnlocks.map((unlock) => unlock.badgeId));

  for (const badge of badges) {
    if (!badge.requiresUnlock && !badge.isMaster) unlockedIds.add(badge.id);
  }

  for (const completion of user.questCompletions) {
    if (completion.quest.badgeId) unlockedIds.add(completion.quest.badgeId);
  }

  for (const attempt of user.quizAttempts) {
    if (attempt.quiz.badgeId) unlockedIds.add(attempt.quiz.badgeId);
    if (attempt.score === attempt.totalQ) unlockedIds.add(39);
  }

  if (user.lastCheckIn) unlockedIds.add(4);
  if (user.streak >= 3) unlockedIds.add(23);

  for (const badge of badges) {
    if (!badge.isMaster) continue;
    const setMembers = badges.filter((member) => member.setName === badge.setName && !member.isMaster);
    const fullSetOwned = setMembers.every((member) => ownedIds.has(member.id));
    if (fullSetOwned) unlockedIds.add(badge.id);
  }

  return unlockedIds;
}
