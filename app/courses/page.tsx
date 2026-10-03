"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Clock3 } from "lucide-react";
import ShowPathName from "@/components/show-path-name";
import { courses, type Course } from "@/lib/course-data";

type SavedProgress = Record<string, { completed: string[]; current: string }>;

function CourseCard({
  course,
  progress,
  onStart,
}: {
  course: Course;
  progress?: SavedProgress[string];
  onStart: (course: Course) => void;
}) {
  const trackableLessons = course.groups
    .flatMap((group) => group.lessons)
    .filter((lesson) => lesson.type !== "attachment");
  const lessonCount = trackableLessons.length;
  const completedCount =
    progress?.completed.filter((id) =>
      trackableLessons.some((lesson) => lesson.id === id),
    ).length ?? 0;
  const percent = Math.round((completedCount / lessonCount) * 100);
  return (
    <article className="min-w-0 overflow-hidden rounded-md border border-[#ebeced] bg-white shadow-[0_6px_25px_#1218270a]">
      <Link
        href={`/courses/course-details?course=${course.id}`}
        className="relative block h-[184px] overflow-hidden bg-[#edf2f4]"
      >
        <Image
          className="object-cover object-center"
          src={course.image}
          alt={course.title}
          fill
          sizes="(max-width: 680px) 100vw, (max-width: 960px) 50vw, 33vw"
        />
        <span className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/40 to-transparent px-3.5 pb-3 pt-10 text-[11px] font-semibold text-white">
          {course.category}
        </span>
      </Link>
      <div className="p-4">
        <p className="mb-1.5 font-poppins text-[10px] font-medium text-[#39a58e]">
          {course.instructor}
        </p>
        <h2 className="m-0 text-lg font-semibold leading-snug">
          <Link
            href={`/courses/course-details?course=${course.id}`}
            className="hover:text-[#485293]"
          >
            {course.title}
          </Link>
        </h2>
        <p className="my-2 min-h-14 font-poppins text-[11px] leading-relaxed text-[#85858d]">
          {course.description}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-[#747680]">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen size={15} />
            {lessonCount} lessons
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={15} />
            {course.duration}
          </span>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-[10px] text-[#777982]">
            <span>Course progress</span>
            <strong className="font-semibold text-[#485293]">{percent}%</strong>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#e8e9ec]">
            <span
              className="block h-full bg-[#6abd8a]"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <button
          className="mt-4 flex w-full items-center justify-between rounded bg-[#41b69d] px-3 py-2.5 text-xs font-semibold text-white hover:bg-[#329c85]"
          onClick={() => onStart(course)}
        >
          {percent ? "Continue" : "Start learning"}
          <ArrowRight size={17} />
        </button>
      </div>
    </article>
  );
}

export default function CoursesPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<SavedProgress>({});

  useEffect(() => {
    const saved = localStorage.getItem("lms-progress");
    if (saved)
      queueMicrotask(() => setProgress(JSON.parse(saved) as SavedProgress));
  }, []);

  function startCourse(course: Course) {
    const saved = progress[course.id];
    const next = saved ?? {
      completed: [],
      current: course.groups[0].lessons[0].id,
    };
    if (!saved) {
      const all = { ...progress, [course.id]: next };
      setProgress(all);
      localStorage.setItem("lms-progress", JSON.stringify(all));
    }
    router.push(
      `/courses/course-details?course=${course.id}&lesson=${next.current || course.groups[0].lessons[0].id}`,
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1340px] px-[18px] py-5 pb-[72px] sm:px-7 sm:pt-7">
      <header className="pb-6 sm:pb-8">
        <ShowPathName />
        <span className="mt-7 block font-poppins text-[10px] font-semibold tracking-[.13em] text-[#37a88d]">
          LEARN SOMETHING NEW
        </span>
        <h1 className="mb-2 mt-2 text-[31px] font-bold leading-tight sm:text-[43px]">
          Explore our courses
        </h1>
        <p className="m-0 max-w-[540px] font-poppins text-sm leading-7 text-[#85858d]">
          Build new skills with practical courses made by people who love to
          teach.
        </p>
      </header>
      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
        aria-label="Available courses"
      >
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            progress={progress[course.id]}
            onStart={startCourse}
          />
        ))}
      </section>
    </main>
  );
}
