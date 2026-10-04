"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlarmClock,
  ArrowRight,
  BookOpen,
  MessageCircle,
  Trophy,
} from "lucide-react";
import ShowPathName from "@/components/show-path-name";
import { getCourse, type Lesson } from "@/lib/course-data";
import VideoPlayer from "@/components/course-player/VideoPlayer";
import CourseProgress from "@/components/course-player/CourseProgress";
import CourseMaterials from "@/components/course-player/CourseMaterials";
import Comments from "@/components/course-player/Comments";
import QuizModal from "@/components/course-player/QuizModal";
import AttachmentModal from "@/components/course-player/AttachmentModal";
import LeaderboardModal from "@/components/course-player/LeaderboardModal";

type SavedProgress = Record<string, { completed: string[]; current: string }>;

export default function PlayerExperience({
  initialCourseId,
  initialLessonId,
}: {
  initialCourseId?: string;
  initialLessonId?: string;
}) {
  const router = useRouter();
  const course = getCourse(initialCourseId);
  const allLessons = useMemo(
    () => course.groups.flatMap((group) => group.lessons),
    [course],
  );
  const [progress, setProgress] = useState<SavedProgress>({});
  const [videoDurations, setVideoDurations] = useState<Record<string, string>>(
    {},
  );
  const [selectedLessonId, setSelectedLessonId] = useState(
    allLessons.some((lesson) => lesson.id === initialLessonId)
      ? initialLessonId!
      : (allLessons[0]?.id ?? ""),
  );
  const [quizLesson, setQuizLesson] = useState<Lesson | null>(null);
  const [attachmentLesson, setAttachmentLesson] = useState<Lesson | null>(null);
  const [autoPlayNext, setAutoPlayNext] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [quizStartedAt, setQuizStartedAt] = useState<number | null>(null);
  const [quizSeconds, setQuizSeconds] = useState(600);
  const quizLessonForCourse = allLessons.find(
    (lesson) => lesson.type === "quiz",
  );
  const updateQuizStartedAt = useCallback(
    (startedAt: number) => setQuizStartedAt(startedAt),
    [],
  );
  const resetQuizStartedAt = useCallback(() => setQuizStartedAt(null), []);

  useEffect(() => {
    const saved = localStorage.getItem("lms-progress");
    const savedDurations = localStorage.getItem("lms-video-durations");
    if (savedDurations)
      queueMicrotask(() =>
        setVideoDurations(JSON.parse(savedDurations) as Record<string, string>),
      );
    if (saved) {
      const parsed = JSON.parse(saved) as SavedProgress;
      const current = initialLessonId ?? parsed[course.id]?.current;
      queueMicrotask(() => {
        setProgress(parsed);
        if (current && allLessons.some((lesson) => lesson.id === current))
          setSelectedLessonId(current);
      });
    }
  }, [allLessons, course.id, initialLessonId]);

  useEffect(() => {
    if (!quizLessonForCourse) return;
    const saved = localStorage.getItem(
      `lms-quiz-${course.id}-${quizLessonForCourse.id}`,
    );
    const quiz = saved
      ? (JSON.parse(saved) as { startedAt?: number; submitted?: boolean })
      : null;
    queueMicrotask(() =>
      setQuizStartedAt(
        quiz?.startedAt && !quiz.submitted ? quiz.startedAt! : null,
      ),
    );
  }, [course.id, quizLessonForCourse]);

  useEffect(() => {
    if (!quizStartedAt) return;
    const update = () =>
      setQuizSeconds(
        Math.max(0, 600 - Math.floor((Date.now() - quizStartedAt) / 1000)),
      );
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [quizStartedAt]);

  const selectedLesson =
    allLessons.find((lesson) => lesson.id === selectedLessonId) ??
    allLessons[0];
  if (!selectedLesson) return null;
  const courseProgress = progress[course.id] ?? {
    completed: [],
    current: selectedLesson?.id ?? "",
  };
  const trackableLessons = allLessons.filter(
    (lesson) => lesson.type !== "attachment",
  );
  const completedTrackableLessons = courseProgress.completed.filter(
    (lessonId) => trackableLessons.some((lesson) => lesson.id === lessonId),
  );
  const percent = trackableLessons.length
    ? Math.round(
        (completedTrackableLessons.length / trackableLessons.length) * 100,
      )
    : 0;

  function saveProgress(next: SavedProgress) {
    setProgress(next);
    localStorage.setItem("lms-progress", JSON.stringify(next));
  }

  function selectLesson(lesson: Lesson) {
    setSelectedLessonId(lesson.id);
    saveProgress({
      ...progress,
      [course.id]: { ...courseProgress, current: lesson.id },
    });
    router.replace(
      `/courses/course-details?course=${course.id}&lesson=${lesson.id}`,
      { scroll: false },
    );
  }

  function completeLesson(lesson: Lesson) {
    const completed = courseProgress.completed.includes(lesson.id)
      ? courseProgress.completed
      : [...courseProgress.completed, lesson.id];
    saveProgress({
      ...progress,
      [course.id]: { ...courseProgress, completed, current: lesson.id },
    });
  }

  function handleVideoEnded(lesson: Lesson) {
    const completed = courseProgress.completed.includes(lesson.id)
      ? courseProgress.completed
      : [...courseProgress.completed, lesson.id];
    const nextVideo = allLessons
      .slice(allLessons.findIndex((item) => item.id === lesson.id) + 1)
      .find((item) => item.type === "video");
    const nextLesson = nextVideo ?? lesson;
    saveProgress({
      ...progress,
      [course.id]: { ...courseProgress, completed, current: nextLesson.id },
    });
    if (nextVideo) {
      setSelectedLessonId(nextVideo.id);
      setAutoPlayNext(true);
      router.replace(
        `/courses/course-details?course=${course.id}&lesson=${nextVideo.id}`,
        { scroll: false },
      );
    }
  }

  function handleModalComplete() {
    if (quizLesson) completeLesson(quizLesson);
    setQuizStartedAt(null);
  }

  function recordVideoDuration(videoUrl: string, duration: number) {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60)
      .toString()
      .padStart(2, "0");
    const formatted = `${minutes}:${seconds}`;
    setVideoDurations((saved) => {
      const next = { ...saved, [videoUrl]: formatted };
      localStorage.setItem("lms-video-durations", JSON.stringify(next));
      return next;
    });
  }

  const videoUrls = [
    ...new Set(
      allLessons.flatMap((lesson) =>
        lesson.videoUrl ? [lesson.videoUrl] : [],
      ),
    ),
  ];

  return (
    <main className="pb-[72px] pt-0">
      <header className="mb-5 bg-[#f5f9fa] py-4">
        <div className="mx-auto w-full max-w-[1390px] px-[18px] sm:px-7 lg:px-11">
          <ShowPathName />
          <div className="mt-3 flex max-sm:flex-col justify-between gap-3 sm:gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="m-0 text-[27px] font-bold leading-tight sm:text-4xl">
                  {course.title}
                </h1>
              </div>
              <p className="mt-2 max-w-[660px] font-poppins text-[13px] leading-7 text-[#83858e]">
                {course.description}
              </p>
            </div>
            <div className="flex flex-col justify-between">
              {quizStartedAt ? (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold ${quizSeconds <= 60 ? "bg-[#ef4444] text-white" : quizSeconds <= 300 ? "bg-[#ffda00] text-[#3d3b32]" : "bg-[#485293] text-white"}`}
                >
                  <AlarmClock size={16} />
                  {String(Math.floor(quizSeconds / 60)).padStart(2, "0")}:
                  {String(quizSeconds % 60).padStart(2, "0")}
                </span>
              ) : null}
              <Link
                href="/courses"
                className="inline-flex shrink-0 items-center gap-2 pb-1 text-[13px] font-semibold text-[#4755a0]"
              >
                All courses <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className="player-layout mx-auto grid w-full max-w-[1390px] grid-cols-1 items-start gap-y-6 md:grid-cols-[minmax(0,2fr)_minmax(290px,.98fr)] md:gap-x-10 md:px-7 lg:px-11">
        <VideoPlayer
          key={selectedLesson.id}
          lesson={selectedLesson}
          onComplete={() => handleVideoEnded(selectedLesson)}
          onDuration={recordVideoDuration}
          autoPlay={autoPlayNext}
          onAutoPlayStarted={() => setAutoPlayNext(false)}
        />
        <section
          className="player-details-area px-4 md:px-0"
          aria-label="Current lesson details"
        >
          <div className="flex items-center justify-between gap-4 py-4">
            <div>
              <span className="text-[9px] font-semibold tracking-[.12em] text-[#9a9ba2]">
                NOW PLAYING
              </span>
              <h2 className="mt-1 text-[17px] font-semibold leading-tight">
                {selectedLesson.title}
              </h2>
            </div>
            {courseProgress.completed.includes(selectedLesson.id) ? (
              <span className="inline-flex items-center rounded border border-[#dce7e3] bg-[#eaf7f0] px-2 py-2 text-[10px] font-semibold text-[#278c71] sm:px-3 sm:text-xs">
                Completed
              </span>
            ) : (
              <button
                className="inline-flex shrink-0 items-center gap-2 rounded border border-[#dce7e3] bg-[#f8fcfa] px-2 py-2 text-[10px] font-semibold text-[#278c71] sm:px-3 sm:text-xs"
                onClick={() => completeLesson(selectedLesson)}
              >
                Mark complete <ArrowRight size={15} />
              </button>
            )}
          </div>
          <div
            className="mt-3 flex flex-wrap gap-2"
            aria-label="Course sections"
          >
            <button
              className="inline-flex items-center gap-2 rounded border border-[#e5e6e9] px-3 py-2 text-xs text-[#626570] hover:border-[#41b69d]"
              onClick={() =>
                document
                  .getElementById("course-content")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <BookOpen size={15} /> Content
            </button>
            <button
              className="inline-flex items-center gap-2 rounded border border-[#e5e6e9] px-3 py-2 text-xs text-[#626570] hover:border-[#41b69d]"
              onClick={() =>
                document
                  .getElementById("course-topics")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <BookOpen size={15} /> Topics
            </button>
            <button
              className="inline-flex items-center gap-2 rounded border border-[#e5e6e9] px-3 py-2 text-xs text-[#626570] hover:border-[#41b69d]"
              onClick={() =>
                document
                  .getElementById("course-comments")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <MessageCircle size={15} /> Comments
            </button>
            <button
              className="inline-flex items-center gap-2 rounded border border-[#e5e6e9] px-3 py-2 text-xs text-[#626570] hover:border-[#41b69d]"
              onClick={() => setLeaderboardOpen(true)}
            >
              <Trophy size={15} /> Leaderboard
            </button>
          </div>
        </section>
        <div className="player-materials-area px-4 md:px-0" id="course-content">
          <CourseMaterials course={course} />
        </div>
        <div className="player-topics-area px-4 md:px-0" id="course-topics">
          <CourseProgress
            course={course}
            selectedLessonId={selectedLesson.id}
            completed={completedTrackableLessons}
            percent={percent}
            durations={videoDurations}
            onSelect={selectLesson}
            onQuiz={setQuizLesson}
            onAttachment={setAttachmentLesson}
          />
        </div>
        <div className="player-comments-area px-4 md:px-0" id="course-comments">
          <Comments courseId={course.id} />
        </div>
      </div>
      <div
        className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
        aria-hidden="true"
      >
        {videoUrls.map((videoUrl) => (
          <video
            key={videoUrl}
            preload="metadata"
            src={videoUrl}
            onLoadedMetadata={(event) =>
              recordVideoDuration(videoUrl, event.currentTarget.duration)
            }
          />
        ))}
      </div>
      {quizLesson ? (
        <QuizModal
          courseId={course.id}
          lesson={quizLesson}
          onStart={updateQuizStartedAt}
          onReset={resetQuizStartedAt}
          onClose={() => setQuizLesson(null)}
          onComplete={handleModalComplete}
        />
      ) : null}
      {attachmentLesson ? (
        <AttachmentModal
          lesson={attachmentLesson}
          onClose={() => setAttachmentLesson(null)}
        />
      ) : null}
      {leaderboardOpen ? (
        <LeaderboardModal
          courseTitle={course.title}
          percent={percent}
          onClose={() => setLeaderboardOpen(false)}
        />
      ) : null}
    </main>
  );
}
