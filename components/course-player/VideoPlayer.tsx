"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle, Play } from "lucide-react";
import type { Lesson } from "@/lib/course-data";

export default function VideoPlayer({
  lesson,
  onComplete,
  onDuration,
  autoPlay,
  onAutoPlayStarted,
}: {
  lesson: Lesson;
  onComplete: () => void;
  onDuration: (videoUrl: string, duration: number) => void;
  autoPlay: boolean;
  onAutoPlayStarted: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (autoPlay && videoRef.current) {
      void videoRef.current.play().catch(() => undefined);
    }
  }, [autoPlay, lesson.id]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const lockLandscape = () => {
      const orientation = window.screen.orientation as ScreenOrientation & {
        lock?: (orientation: string) => Promise<void>;
      };
      void orientation.lock?.("landscape").catch(() => undefined);
    };
    const unlockOrientation = () => {
      const orientation = window.screen.orientation as ScreenOrientation & {
        unlock?: () => void;
      };
      orientation.unlock?.();
    };
    const onFullscreenChange = () => {
      if (document.fullscreenElement === video) lockLandscape();
      else unlockOrientation();
    };
    const onWebkitBegin = () => lockLandscape();
    const onWebkitEnd = () => unlockOrientation();
    document.addEventListener("fullscreenchange", onFullscreenChange);
    video.addEventListener("webkitbeginfullscreen", onWebkitBegin);
    video.addEventListener("webkitendfullscreen", onWebkitEnd);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      video.removeEventListener("webkitbeginfullscreen", onWebkitBegin);
      video.removeEventListener("webkitendfullscreen", onWebkitEnd);
    };
  }, []);

  async function playVideo() {
    await videoRef.current?.play();
    setPlaying(true);
  }

  return (
    <div className="player-video-area relative bg-[#111] max-md:sticky top-0 z-30">
      <video
        key={lesson.id}
        ref={videoRef}
        className="block h-full w-full bg-black object-contain [&:fullscreen]:h-dvh [&:fullscreen]:w-dvw [&:fullscreen]:object-contain"
        src={lesson.videoUrl}
        poster={lesson.thumbnailUrl}
        preload="metadata"
        controls={ready}
        playsInline
        onPlay={() => {
          setPlaying(true);
          if (autoPlay) onAutoPlayStarted();
        }}
        onPause={() => setPlaying(false)}
        onEnded={onComplete}
        onLoadStart={() => setReady(false)}
        onCanPlay={() => setReady(true)}
        onPlaying={() => setReady(true)}
        onWaiting={() => setReady(false)}
        onStalled={() => setReady(false)}
        onError={() => setReady(true)}
        onLoadedMetadata={(event) =>
          onDuration(lesson.videoUrl ?? "", event.currentTarget.duration)
        }
        aria-label={lesson.title}
      />
      {!ready ? (
        <span
          className="pointer-events-none absolute inset-0 grid place-items-center bg-black/20 text-white"
          aria-label="Loading video"
        >
          <LoaderCircle className="animate-spin" size={32} />
        </span>
      ) : !playing ? (
        <button
          className="absolute left-1/2 top-1/2 grid aspect-square w-15 shadow-2xl -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[#f04467]"
          onClick={playVideo}
          aria-label="Play lesson video"
        >
          <Play className="h-[30%] w-[30%] fill-current" />
        </button>
      ) : null}
    </div>
  );
}
