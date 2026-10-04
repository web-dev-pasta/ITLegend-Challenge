import { Check, Lock, Play } from "lucide-react";
import type { Course, Lesson } from "@/lib/course-data";

export default function CourseProgress({
  course,
  selectedLessonId,
  completed,
  percent,
  durations,
  onSelect,
  onQuiz,
  onAttachment,
}: {
  course: Course;
  selectedLessonId: string;
  completed: string[];
  percent: number;
  durations: Record<string, string>;
  onSelect: (lesson: Lesson) => void;
  onQuiz: (lesson: Lesson) => void;
  onAttachment: (lesson: Lesson) => void;
}) {
  return (
    <aside>
      <h2 className="m-0 text-lg font-semibold leading-relaxed">
        Topics for This Course
      </h2>
      <div
        className="my-15 h-1 rounded-full bg-[#e5e6e8] max-lg:w-11/12 mx-auto"
        aria-label={`Course progress ${percent}%`}
      >
        <div
          className="relative h-full rounded-full bg-[#6abd8a]"
          style={{ width: `${percent}%` }}
        >
          <span className="w-8 h-8 flex justify-center items-center absolute -right-4 bottom-6 rounded-full border-2 border-[#c8c8c8] bg-white px-1.5 py-1 font-poppins text-[11px] font-medium text-[#485293] after:absolute after:left-1/2 after:-bottom-3 after:-translate-x-1/2 after:border-x-[5px] after:border-x-transparent after:border-t-[6px] after:border-t-[#c8c8c8]">
            You
          </span>
          <span className="absolute -right-4 top-3 font-poppins text-[11px] font-medium text-[#485293]">
            {percent}%
          </span>
        </div>
      </div>
      {course.groups.map((group) => (
        <section
          className="mb-7 last:mb-0 border border-[#e5e5e7] pt-4"
          key={group.title}
        >
          <header className="px-2">
            <h3 className="m-0 text-[13px] font-semibold leading-relaxed">
              {group.title}
            </h3>
            <p className="mb-2.5 mt-1 font-poppins text-[10px] leading-relaxed text-[#8b8d94]">
              {group.description}
            </p>
          </header>
          {group.lessons.map((lesson) => {
            const isSelected = lesson.id === selectedLessonId;
            const isDone = completed.includes(lesson.id);
            return (
              <button
                className={`flex min-h-9 px-2 w-full items-center justify-between gap-2 border-0 border-t border-solid border-t-[#ececee] py-2 text-left font-poppins text-[11px] leading-snug hover:text-[#485293] ${isSelected ? "bg-[#f4f5fc] font-semibold text-[#485293]" : "bg-transparent text-[#777982]"}`}
                key={lesson.id}
                onClick={() =>
                  lesson.type === "quiz"
                    ? onQuiz(lesson)
                    : lesson.type === "attachment"
                      ? onAttachment(lesson)
                      : onSelect(lesson)
                }
                aria-current={isSelected ? "step" : undefined}
              >
                <span className="flex min-w-0 items-center gap-1.5">
                  {isDone ? (
                    <Check className="mt-0.5 shrink-0" size={13} />
                  ) : lesson.type === "video" ? (
                    <Play className="mt-0.5 shrink-0" size={12} />
                  ) : (
                    <span className="mt-0.5 shrink-0 text-xs">▤</span>
                  )}
                  <span className="break-words">{lesson.title}</span>
                </span>
                <span className="flex items-center gap-1">
                  {lesson.type === "quiz" ? (
                    <span className="bg-[#e9f7f2] px-1 py-0.5 font-poppins text-[8px] text-[#61b69c]">
                      5 QUESTIONS
                    </span>
                  ) : null}
                  {lesson.type === "quiz" ? (
                    <span className="bg-[#fff0f1] px-1 py-0.5 font-poppins text-[8px] text-[#eb7380]">
                      10 MINUTES
                    </span>
                  ) : lesson.videoUrl && durations[lesson.videoUrl] ? (
                    <span>{durations[lesson.videoUrl]}</span>
                  ) : null}
                  {lesson.type === "attachment" ? <Lock size={13} /> : null}
                </span>
              </button>
            );
          })}
        </section>
      ))}
    </aside>
  );
}
