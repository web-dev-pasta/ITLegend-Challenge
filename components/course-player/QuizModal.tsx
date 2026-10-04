"use client";

import { useEffect, useRef, useState } from "react";
import { AlarmClock, ArrowLeft, ArrowRight } from "lucide-react";
import { getQuizQuestions, type Lesson } from "@/lib/course-data";

type SavedQuiz = {
  startedAt: number | null;
  answers: number[];
  submitted: boolean;
};
const quizDuration = 10 * 60;
const newQuiz = (): SavedQuiz => ({
  startedAt: null,
  answers: Array(5).fill(-1),
  submitted: false,
});

export default function QuizModal({
  courseId,
  lesson,
  onStart,
  onReset,
  onClose,
  onComplete,
}: {
  courseId: string;
  lesson: Lesson;
  onStart: (startedAt: number) => void;
  onReset: () => void;
  onClose: () => void;
  onComplete: () => void;
}) {
  const questions = getQuizQuestions();
  const key = `lms-quiz-${courseId}-${lesson.id}`;
  const [quiz, setQuiz] = useState<SavedQuiz | null>(null);
  const [seconds, setSeconds] = useState(quizDuration);
  const [questionIndex, setQuestionIndex] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const startedAt = quiz?.startedAt;
  const submitted = quiz?.submitted;

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(key);
    const loaded = saved ? (JSON.parse(saved) as SavedQuiz) : newQuiz();
    queueMicrotask(() => {
      setQuiz(loaded);
      if (loaded.startedAt && !loaded.submitted) onStart(loaded.startedAt);
      if (loaded.startedAt)
        setSeconds(
          Math.max(
            0,
            quizDuration - Math.floor((Date.now() - loaded.startedAt) / 1000),
          ),
        );
    });
  }, [key, onStart]);

  useEffect(() => {
    if (!startedAt || submitted) return;
    const timer = window.setInterval(() => {
      const remaining = Math.max(
        0,
        quizDuration - Math.floor((Date.now() - startedAt) / 1000),
      );
      setSeconds(remaining);
      if (remaining === 0) {
        const saved = localStorage.getItem(key);
        const latest = saved
          ? (JSON.parse(saved) as SavedQuiz)
          : { startedAt, answers: Array(5).fill(-1), submitted: false };
        const expired = { ...latest, submitted: true };
        setQuiz(expired);
        localStorage.setItem(key, JSON.stringify(expired));
        onCompleteRef.current();
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [key, startedAt, submitted]);

  function startQuiz() {
    if (!quiz || quiz.startedAt) return;
    const started = { ...quiz, startedAt: Date.now() };
    setQuiz(started);
    setSeconds(quizDuration);
    localStorage.setItem(key, JSON.stringify(started));
    onStart(started.startedAt!);
  }

  function retakeQuiz() {
    const restarted = newQuiz();
    setQuiz(restarted);
    setSeconds(quizDuration);
    setQuestionIndex(0);
    localStorage.setItem(key, JSON.stringify(restarted));
    onReset();
  }

  function chooseAnswer(optionIndex: number) {
    if (!quiz || quiz.submitted || seconds <= 0) return;
    const next = {
      ...quiz,
      answers: quiz.answers.map((answer, index) =>
        index === questionIndex
          ? answer === optionIndex
            ? -1
            : optionIndex
          : answer,
      ),
    };
    setQuiz(next);
    localStorage.setItem(key, JSON.stringify(next));
  }

  function finishQuiz() {
    if (!quiz) return;
    const next = { ...quiz, submitted: true };
    setQuiz(next);
    localStorage.setItem(key, JSON.stringify(next));
    onComplete();
  }

  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  const locked = !quiz || quiz.submitted || seconds <= 0;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#121a44b3] p-0 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label="Course quiz"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full flex-col overflow-auto bg-gradient-to-br from-[#384bb2] to-[#596df7] px-3.5 py-[18px] font-[family-name:var(--font-spartan)] text-white sm:h-auto sm:max-h-[90dvh] sm:w-[420px] sm:rounded-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex min-h-10 items-center justify-between gap-2">
          <button
            className="bg-transparent p-1 text-white"
            onClick={onClose}
            aria-label="Close quiz"
          >
            <ArrowLeft size={22} />
          </button>
          {quiz?.startedAt ? (
            <span className="inline-flex items-center gap-1.5 w-23 justify-center rounded-md bg-[#ffda00] px-[15px] py-2 text-sm font-semibold text-[#3d3b32] shadow-[0_4px_16px_#ffdd0080]">
              <AlarmClock size={17} /> {minutes}:{remainder}
            </span>
          ) : (
            <span className="text-sm font-medium">Course Quiz</span>
          )}
          <button className="h-7.5 w-7.5" />
        </header>
        {!quiz?.startedAt ? (
          <section className="my-auto rounded-2xl bg-white px-6 py-9 text-center text-[#303044] shadow-lg">
            <AlarmClock className="mx-auto mb-4 text-[#5369dc]" size={36} />
            <h2 className="text-xl font-semibold">Ready to start?</h2>
            <p className="mt-3 font-poppins text-sm leading-6 text-[#777982]">
              This quiz has five questions and a 10-minute timer. Your answers
              will be saved while you work.
            </p>
            {quiz?.submitted ? (
              <div className="mt-5">
                <p className="text-sm font-semibold text-[#eb7380]">
                  This quiz has already been submitted.
                </p>
                <button
                  className="mt-4 rounded-md bg-[#5369dc] px-5 py-3 text-sm font-semibold text-white"
                  onClick={retakeQuiz}
                >
                  Retake quiz
                </button>
              </div>
            ) : (
              <button
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#41b69d] px-5 py-3 text-sm font-semibold text-white hover:bg-[#329c85] disabled:opacity-60"
                onClick={startQuiz}
                disabled={!quiz}
              >
                Start quiz <ArrowRight size={17} />
              </button>
            )}
          </section>
        ) : (
          <>
            <nav
              className="flex justify-center gap-2.5 py-[30px] pb-[38px]"
              aria-label="Quiz questions"
            >
              {questions.map((item, index) => (
                <button
                  key={item.prompt}
                  className={`h-[39px] w-[39px] rounded-full border text-sm ${questionIndex === index ? "border-white bg-white font-bold text-[#4b5fc9]" : quiz.answers[index] !== -1 ? "border-[#94e4c4] bg-[#247e6c] text-white" : "border-white/60 bg-transparent text-white/65"}`}
                  onClick={() => setQuestionIndex(index)}
                >
                  {index + 1}
                </button>
              ))}
            </nav>
            <section className="flex-1 rounded-[17px] bg-white px-5 py-7 text-[#303044]">
              <div>
                <strong className="text-sm">{questionIndex + 1}.</strong>
                <h2 className="mb-6 mt-2 text-[15px] font-semibold leading-7">
                  {questions[questionIndex].prompt}
                </h2>
              </div>
              <div className="flex flex-col gap-[13px]">
                {questions[questionIndex].options.map((option, index) => (
                  <button
                    key={option}
                    className={`p-4 rounded-md text-left text-[13px] shadow-[0_4px_14px_#45527d2c] disabled:opacity-100 ${quiz.answers[questionIndex] === index ? "bg-[#5b78fa] text-white" : "bg-white text-[#505166]"}`}
                    onClick={() => chooseAnswer(index)}
                    disabled={locked}
                  >
                    <span>{option}</span>
                  </button>
                ))}
              </div>
              {locked ? (
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <p className="m-0 text-[11px] text-[#8c8d97]">
                    {seconds === 0
                      ? "Time is up. Your answers are saved."
                      : "Your answers are submitted and locked."}
                  </p>
                  <button
                    className="rounded bg-[#5369dc] px-3 py-2 text-xs font-semibold text-white"
                    onClick={retakeQuiz}
                  >
                    Retake quiz
                  </button>
                </div>
              ) : null}
            </section>
            <footer className="flex min-h-[59px] items-center justify-between pt-3">
              <button
                className="inline-flex items-center gap-1.5 rounded bg-white px-3 py-2 text-xs text-[#4959b4] disabled:opacity-50"
                disabled={questionIndex === 0}
                onClick={() => setQuestionIndex((index) => index - 1)}
              >
                <ArrowLeft size={17} /> Previous
              </button>
              {!locked && questionIndex === questions.length - 1 ? (
                <button
                  className="rounded bg-[#ffdc05] px-3 py-2 text-xs font-semibold text-[#33313a]"
                  onClick={finishQuiz}
                >
                  Submit quiz
                </button>
              ) : null}
              {questionIndex < questions.length - 1 ? (
                <button
                  className="inline-flex items-center gap-1.5 rounded bg-white px-3 py-2 text-xs text-[#4959b4]"
                  onClick={() => setQuestionIndex((index) => index + 1)}
                >
                  Next <ArrowRight size={17} />
                </button>
              ) : null}
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
