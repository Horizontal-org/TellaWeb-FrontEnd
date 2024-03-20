import { useMediaPlayer } from "packages/ui/hooks/useMediaPlayer";
import { FunctionComponent, useRef } from "react";
import { IReportFile } from "../../domain/ReportFile";
import { MediaButtons } from "../MediaControls/MediaButtons";
import { MediaProgressBar } from "../MediaControls/MediaProgressBar";
import MediaLoader from "../MediaLoader/MediaLoader";

type Props = {
  file: IReportFile;
};

export const VideoView: FunctionComponent<React.PropsWithChildren<Props>> = ({ file }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
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
  } = useMediaPlayer(videoRef);

  return (
    <div className=" w-full h-full flex flex-col items-center">
      <div
        className="relative flex justify-center items-center"
        style={{
          width: "100%",
          maxWidth: "40vw",
        }}
      >
          <video
            key={file.src}
            preload="metadata"
            crossOrigin="use-credentials"
            className={"w-full"}
            ref={videoRef}
            >
            <source src={file.src} key={file.src} type='video/mp4' />
            Your browser does not support the <code>video</code> element.
          </video>

          {!duration && (
            <div className="absolute">
              <MediaLoader />
            </div>
          )}
        {/* <LazyLoad>
        </LazyLoad> */}
      </div>

      {!!duration && (
        <div className="w-full flex justify-center">
          <div
            style={{
              width: "100%",
              maxWidth: "40vw",
            }}
          >
            <div className="w-full flex justify-center">
              <div style={{ width: "40vw" }}>
                <div className="w-full py-4 pt-16">
                  <div>
                    <MediaButtons
                      isVideo={true}
                      isPlaying={isPlaying}
                      muted={isMuted}
                      volume={volume}
                      addTen={() => addTime(10)}
                      subTen={() => addTime(-10)}
                      play={() => videoRef?.current?.play()}
                      pause={() => videoRef?.current?.pause()}
                      requestFullscreen={() =>
                        videoRef?.current.requestFullscreen()
                      }
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
        </div>
      )}
    </div>
  );
};
