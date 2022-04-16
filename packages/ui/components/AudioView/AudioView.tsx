import { useState, useEffect, useRef } from "react";

import { calcPercentage } from "../../utilities/calcPercentage";
import { IReportFile } from "../../domain/ReportFile";
import { MediaButtons } from "../MediaControls/MediaButtons";
import { MediaProgressBar } from "../MediaControls/MediaProgressBar";
import { AudioVisualization } from "./AudioVisualization";
import { useMediaPlayer } from "../../hooks/useMediaPlayer";

type Props = {
  file: IReportFile;
};

export const AudioView = ({ file }: Props) => {
  const audioRef = useRef<HTMLAudioElement>();
  const {
    currentTime,
    duration,
    volume,
    isPlaying,
    isMuted,
    addTime,
    changeTime,
    changeVolume,
    toggleMuted,
  } = useMediaPlayer(audioRef);

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
