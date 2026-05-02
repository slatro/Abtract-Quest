"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useParams, useRouter } from "next/navigation";

type Phase = "intro" | "question" | "result";

export default function QuizPage() {
  const { address } = useAccount();
  const router = useRouter();
  const params = useParams<{ quizId: string }>();
  const quizId = `quiz-${params.quizId}`;

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; answerText: string }[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const { data: quiz, isLoading } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: async () => {
      const res = await fetch(`/api/quiz/${quizId}`);
      const json = await res.json();
      return json.data;
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (answers: any[]) => {
      const res = await fetch(`/api/quiz/${quizId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: address, answers }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      setResult(data.data);
      setPhase("result");
    },
  });

  function handleAnswer(answerText: string) {
    if (selected) return;
    setSelected(answerText);
  }

  function handleNext() {
    if (!selected || !quiz) return;

    const question = quiz.questions[currentQ];
    const newAnswers = [...answers, { questionId: question.id, answerText: selected }];
    setAnswers(newAnswers);
    setSelected(null);

    if (currentQ + 1 >= quiz.questions.length) {
      submitMutation.mutate(newAnswers);
    } else {
      setCurrentQ(currentQ + 1);
    }
  }

  if (isLoading) return <div className="text-sm text-text-2 p-8">Loading quiz...</div>;
  if (!quiz) return <div className="text-sm text-text-2 p-8">Quiz not found.</div>;

  const question = quiz.questions[currentQ];
  const progress = (currentQ / quiz.questions.length) * 100;

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      {/* Intro */}
      {phase === "intro" && (
        <div className="text-center">
          <div className="text-5xl mb-6">📚</div>
          <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
          <p className="text-sm text-text-2 mb-2">
            {quiz.category} · {quiz.difficulty}
          </p>
          <p className="text-sm text-text-2 mb-8">{quiz.questions.length} questions · Pass at 60%</p>
          {!address ? (
            <p className="text-sm text-amber-400">Connect your wallet to attempt this quiz.</p>
          ) : (
            <button
              onClick={() => setPhase("question")}
              className="px-8 py-3 rounded-xl bg-green text-[#061009] font-bold text-sm"
            >
              Start quiz
            </button>
          )}
        </div>
      )}

      {/* Question */}
      {phase === "question" && (
        <div>
          {/* Progress */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-2 font-mono">
              {currentQ + 1} / {quiz.questions.length}
            </span>
            <span className="text-xs text-text-2">{quiz.title}</span>
          </div>
          <div className="h-1 bg-bg2 rounded-full mb-8">
            <div
              className="h-full bg-green rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Question */}
          <h2 className="text-base font-semibold mb-6 leading-relaxed">{question.question}</h2>

          {/* Answers */}
          <div className="flex flex-col gap-3 mb-8">
            {question.answers.map((answer: string, i: number) => (
              <button
                key={i}
                onClick={() => handleAnswer(answer)}
                className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all ${
                  selected === answer
                    ? "border-green bg-green/10 text-green"
                    : "border-border bg-card hover:border-border-2 text-text"
                }`}
              >
                <span className="font-mono text-text-3 mr-3 text-xs">{["A", "B", "C", "D"][i]}</span>
                {answer}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!selected}
            className="w-full py-3.5 rounded-xl bg-green text-[#061009] font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {currentQ + 1 >= quiz.questions.length ? "Submit" : "Next →"}
          </button>
        </div>
      )}

      {/* Result */}
      {phase === "result" && result && (
        <div className="text-center">
          <div className="text-5xl mb-4">{result.perfectScore ? "🎯" : result.passed ? "✅" : "❌"}</div>
          <h2 className="text-2xl font-bold mb-1">
            {result.perfectScore ? "Perfect score!" : result.passed ? "Passed!" : "Not quite"}
          </h2>
          <p className="text-text-2 text-sm mb-6">
            {result.score}/{result.totalQ} correct · +{result.xpGained} XP
          </p>

          {result.unlockedBadgeId && (
            <div className="bg-green/10 border border-green/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-green font-semibold">🏷️ Badge unlocked! Go mint it.</p>
            </div>
          )}

          {/* Per-question results */}
          <div className="flex flex-col gap-3 mb-8 text-left">
            {result.results.map((r: any, i: number) => (
              <div
                key={i}
                className={`p-4 rounded-xl border text-sm ${
                  r.isCorrect ? "border-green/20 bg-green/5" : "border-red-400/20 bg-red-400/5"
                }`}
              >
                <p className="font-medium mb-1">{r.question}</p>
                <p className="text-xs text-text-2 mb-1">
                  Your answer:{" "}
                  <span className={r.isCorrect ? "text-green" : "text-red-400"}>
                    {r.userAnswer ?? "No answer"}
                  </span>
                </p>
                {!r.isCorrect && (
                  <p className="text-xs text-text-2">
                    Correct: <span className="text-green">{r.correctAnswer}</span>
                  </p>
                )}
                <p className="text-xs text-text-3 mt-1">{r.explanation}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/gallery")}
              className="flex-1 py-3 rounded-xl bg-green text-[#061009] font-bold text-sm"
            >
              View badges
            </button>
            <button
              onClick={() => router.push("/quests")}
              className="flex-1 py-3 rounded-xl border border-border text-sm text-text-2"
            >
              Back to quests
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
