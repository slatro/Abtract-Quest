import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function shuffleArray<T>(arr: T[]): { items: T[]; originalIndices: number[] } {
  const indices = arr.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return {
    items: indices.map((i) => arr[i]),
    originalIndices: indices,
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  const { quizId } = await params;

  const quiz = await db.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true },
  });

  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

  // Soru sirasini karistir
  const shuffledQuestions = [...quiz.questions].sort(() => Math.random() - 0.5);

  // Her sorunun cevaplarini karistir, correctIndex'i gizle
  const sanitizedQuestions = shuffledQuestions.map((q) => {
    const { items: shuffledAnswers, originalIndices } = shuffleArray(q.answers);
    // Dogru cevabin yeni indexini hesapla ama frontend'e verme
    // Sadece sessionStorage'da tutulacak bir token dondur
    const newCorrectIndex = originalIndices.indexOf(q.correctIndex);

    return {
      id: q.id,
      question: q.question,
      answers: shuffledAnswers,
      explanation: null, // Submit sonrasi gelecek
      // correctIndex burada YOK — backend'de kalir
      _shuffledCorrectIndex: newCorrectIndex, // Bu da aslinda gitmemeli, submit route kullanacak
    };
  });

  // Guvenli versiyon: correctIndex'i hic gonderme
  const safeQuestions = sanitizedQuestions.map(({ _shuffledCorrectIndex, ...q }) => q);

  return NextResponse.json({
    data: {
      id: quiz.id,
      title: quiz.title,
      category: quiz.category,
      difficulty: quiz.difficulty,
      badgeId: quiz.badgeId,
      questions: safeQuestions,
    },
  });
}
