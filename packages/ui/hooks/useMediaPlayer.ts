import { MutableRefObject, useEffect, useState } from "react";

export const useMediaPlayer = (
  mediaRef: MutableRefObject<HTMLMediaElement>
) => {
  const [volume, setVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!mediaRef?.current) return;

    const onTimeUpdate = () => {
      if (!mediaRef.current) return;
      setCurrentTime(mediaRef.current.currentTime || 0);
    };

    const onPlay = () => {
      setIsPlaying(true);
    };

    const onPause = () => {
      setIsPlaying(false);
    };

    const onEnded = () => {
      if (!mediaRef.current) return;
      mediaRef.current.pause();
      mediaRef.current.currentTime = 0;
    };

    const onVolumeChanged = () => {
      if (!mediaRef.current) return;

      setIsMuted(mediaRef.current.muted);
      setVolume(mediaRef.current.volume * 10);
    };

    const onLoadedMetadata = () => {
      if (!mediaRef.current) return;

      setDuration(mediaRef.current.duration);
      onTimeUpdate();
      onVolumeChanged();
    };

    mediaRef.current.addEventListener("timeupdate", onTimeUpdate);
    mediaRef.current.addEventListener("playing", onPlay);
    mediaRef.current.addEventListener("pause", onPause);
    mediaRef.current.addEventListener("ended", onEnded);
    mediaRef.current.addEventListener("volumechange", onVolumeChanged);
    mediaRef.current.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      mediaRef.current?.removeEventListener("timeupdate", onTimeUpdate);
      mediaRef.current?.removeEventListener("playing", onPlay);
      mediaRef.current?.removeEventListener("pause", onPause);
      mediaRef.current?.removeEventListener("ended", onEnded);
      mediaRef.current?.removeEventListener("volumechange", onVolumeChanged);
      mediaRef.current?.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [mediaRef?.current]);

  const changeTime = (value) => {
    if (typeof mediaRef?.current?.currentTime !== "undefined") {
      mediaRef.current.currentTime = value;
    }
  };

  const addTime = (value) => {
    if (typeof mediaRef?.current?.currentTime !== "undefined") {
      mediaRef.current.currentTime += value;
    }
  };

  const toggleMuted = () => {
    if (mediaRef?.current) {
      mediaRef.current.muted = !mediaRef.current.muted;
    }
  };

  const changeVolume = (value: number) => {
    if (mediaRef?.current) {
      mediaRef.current.volume = value / 10;
    }
  };

  const toggleFullscreen = () => {
    if (mediaRef?.current && mediaRef.current.requestFullscreen) {
      mediaRef.current.requestFullscreen();
    }
  };

  return {
    volume,
    isMuted,
    duration,
    currentTime,
    isPlaying,
    changeTime,
    addTime,
    toggleMuted,
    changeVolume,
  };
};
