"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type HeroVideoItem = {
  src: string;
};

export function HeroVideoBackground({ videos, poster }: { videos: HeroVideoItem[]; poster: string }) {
  const safeVideos = useMemo(() => videos.filter((v) => Boolean(v.src)), [videos]);
  const [showVideo, setShowVideo] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!safeVideos.length) return;
    const timer = window.setTimeout(() => {
      setVideoIndex(0);
      setShowVideo(true);
    }, 3_000);

    return () => window.clearTimeout(timer);
  }, [safeVideos.length]);

  useEffect(() => {
    if (!showVideo) return;
    const el = videoRef.current;
    if (!el) return;
    const p = el.play();
    if (p && typeof p.catch === "function") p.catch(() => undefined);
  }, [showVideo, videoIndex]);

  if (!poster && !safeVideos.length) return null;

  const current = safeVideos[videoIndex];

  return (
    <>
      <Image src={poster} alt="首页背景封面" fill priority className="object-cover" sizes="100vw" />

      {current ? (
        <video
          ref={videoRef}
          key={current.src}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[900ms] ${showVideo ? "opacity-100" : "opacity-0"}`}
          autoPlay
          muted
          playsInline
          preload="auto"
          poster={poster}
          onEnded={() => {
            if (videoIndex < safeVideos.length - 1) {
              setVideoIndex((prev) => prev + 1);
              return;
            }
            // 一轮播放结束，回到封面图
            setShowVideo(false);
            setVideoIndex(0);
          }}
          aria-label="首页背景视频"
        >
          <source src={current.src} type="video/mp4" />
        </video>
      ) : null}
    </>
  );
}
