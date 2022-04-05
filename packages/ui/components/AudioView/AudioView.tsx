import { useState, useEffect, useRef } from "react";

import { calcPercentage } from "../../utilities/calcPercentage";
import { IReportFile } from "../../domain/ReportFile";
import { MediaButtons } from "../MediaControls/MediaButtons";
import { MediaProgressBar } from "../MediaControls/MediaProgressBar";
import { AudioVisualization } from "./AudioVisualization";

type Props = {
  file: IReportFile;
};

export const AudioView = ({ file }: Props) => {
  const audioRef = useRef<HTMLAudioElement>();

  const [volume, setVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!audioRef?.current) return;

    const onTimeUpdate = () => {
      setCurrentTime(audioRef.current.currentTime || 0);
    };

    const onPlay = () => {
      setIsPlaying(true);
    };

    const onPause = () => {
      setIsPlaying(false);
    };

    const onEnded = () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };

    const onVolumeChanged = () => {
      if (audioRef?.current) {
        setIsMuted(audioRef.current.muted);
        setVolume(audioRef.current.volume * 10);
      }
    };

    const onLoadedMetadata = () => {
      if (audioRef?.current?.duration) {
        setDuration(audioRef.current.duration);
        onTimeUpdate();
        onVolumeChanged();
      }
    };

    audioRef.current.addEventListener("timeupdate", onTimeUpdate);
    audioRef.current.addEventListener("playing", onPlay);
    audioRef.current.addEventListener("pause", onPause);
    audioRef.current.addEventListener("ended", onEnded);
    audioRef.current.addEventListener("volumechange", onVolumeChanged);
    audioRef.current.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      audioRef.current?.removeEventListener("timeupdate", onTimeUpdate);
      audioRef.current?.removeEventListener("playing", onPlay);
      audioRef.current?.removeEventListener("pause", onPause);
      audioRef.current?.removeEventListener("ended", onEnded);
      audioRef.current?.removeEventListener("volumechange", onVolumeChanged);
      audioRef.current?.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [audioRef?.current]);

  const changeTime = (value) => {
    if (typeof audioRef?.current?.currentTime !== "undefined") {
      audioRef.current.currentTime = value;
    }
  };

  const addTime = (value) => {
    if (typeof audioRef?.current?.currentTime !== "undefined") {
      audioRef.current.currentTime += value;
    }
  };

  const toggleMuted = () => {
    if (audioRef?.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
  };

  const changeVolume = (value: number) => {
    if (audioRef?.current) {
      audioRef.current.volume = value / 10;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center px-10">
      <audio
        preload="auto"
        crossOrigin="use-credentials"
        src={file.src}
        ref={audioRef}
      />
      <div
        style={{
          width: "40vw",
        }}
      >
        <AudioVisualization
          currentPercentage={calcPercentage(currentTime, duration)}
        />
      </div>
      <div className="w-full flex justify-center">
        <div style={{ width: "40vw" }}>
          <div className="w-full py-4 pt-16">
            <div>
              <MediaButtons
                isVideo={false}
                isPlaying={isPlaying}
                muted={isMuted}
                volume={volume}
                addTen={() => addTime(10)}
                subTen={() => addTime(-10)}
                play={() => audioRef?.current?.play()}
                pause={() => audioRef?.current?.pause()}
                requestFullscreen={() => {}}
                toggleMuted={toggleMuted}
                toggleVolume={changeVolume}
              />

              <MediaProgressBar
                currentTime={currentTime}
                duration={duration}
                onBarClick={changeTime}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
