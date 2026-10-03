"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, PlayCircle } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-[#f5f9fa] px-5 py-6 sm:px-9 sm:py-8">
      <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-[#182578]"
        >
          ITLegend<span className="text-[#41b69d]">.</span>
        </Link>
        <Link
          href="/courses"
          className="font-poppins text-sm font-medium text-[#485293] hover:text-[#41b69d]"
        >
          Browse courses
        </Link>
      </div>

      <section className="mx-auto mt-10 grid min-h-[min(680px,76dvh)] w-full max-w-[1240px] items-center overflow-hidden rounded-[28px] bg-[#182578] px-7 py-12 text-white sm:px-14 lg:grid-cols-[1.15fr_.85fr] lg:px-20">
        <div className="max-w-[620px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-poppins text-[11px] font-medium text-[#bde9df]">
            <BookOpen size={15} /> YOUR NEXT SKILL STARTS HERE
          </span>
          <h1 className="mt-7 max-w-[600px] text-4xl font-bold leading-[1.12] sm:text-6xl">
            Learn something new. Build something great.
          </h1>
          <p className="mt-5 max-w-[500px] font-poppins text-sm leading-7 text-white/70 sm:text-base">
            Practical courses, clear lessons, and a learning path that keeps you
            moving forward.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/courses"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#41b69d] px-6 text-sm font-semibold text-white transition hover:bg-[#329c85]"
            >
              Browse courses <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        <div className="relative mx-auto mt-12 hidden h-[380px] w-full max-w-[390px] items-center justify-center lg:flex">
          <div className="absolute h-[310px] w-[310px] rounded-full bg-[#41b69d]/20 blur-3xl" />
          <div className="relative w-full rotate-[-5deg] rounded-2xl border border-white/15 bg-white/10 p-5 shadow-[0_28px_80px_#0b124b80] backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#41b69d]">
                  <BookOpen size={16} />
                </span>
                Learning path
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] text-white/70">
                Keep going
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {[
                {
                  title: "Choose a course",
                  label: "START LEARNING",
                  active: false,
                },
                {
                  title: "Learn at your pace",
                  label: "VIDEO LESSONS",
                  active: true,
                },
                {
                  title: "Track your progress",
                  label: "REACH YOUR GOAL",
                  active: false,
                },
              ].map((step, index) => (
                <div
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#101a62]/55 p-4"
                  key={step.title}
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold ${step.active ? "bg-[#41b69d] text-white" : "bg-white/10 text-white/70"}`}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="m-0 text-sm font-semibold">{step.title}</p>
                    <span className="font-poppins text-[9px] tracking-[.12em] text-white/50">
                      {step.label}
                    </span>
                  </div>
                  {step.active ? (
                    <PlayCircle className="ml-auto text-[#77d4bd]" size={20} />
                  ) : null}
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl bg-white p-4 text-[#182578]">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>Your next lesson</span>
                <span className="text-[#41b69d]">Ready when you are</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e8e9ec]">
                <div className="h-full w-2/3 rounded-full bg-[#41b69d]" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
