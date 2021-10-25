import { FunctionComponent, useState, useEffect, useRef } from 'react'
import { IReportFile } from '../../domain/ReportFile'
import { AudioControls } from './AudioControls'
import { AudioVisualization } from './AudioVisualization'

type Props = {
  file: IReportFile
};

export const AudioView: FunctionComponent<Props> = ({file}) => {
  const [duration, setDuration] = useState<number>(0)
  const [curTime, setCurTime] = useState<number>(0)
  const [isPlaying, handlePlaying] = useState<boolean>(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentPercentage = (curTime / duration) * 100;

  useEffect(() => {
    if (!audioRef) {
      return
    }

    const setAudioData = () => {
      setDuration(audioRef.current.duration);
      setCurTime(audioRef.current.currentTime);
    }

    const setAudioTime = () => {
      audioRef.current && setCurTime(audioRef.current.currentTime)
    }

    audioRef.current.addEventListener("canplaythrough", setAudioData);
    // audioRef.current.addEventListener("stalled", () => {
    //   console.log('is stalled')
    // })

    // audioRef.current.addEventListener("completed", () => {
    //   console.log('completed')
    // })

    // audioRef.current.addEventListener("ended", () => {
    //   audioRef.current.currentTime = 0
    //   handlePlaying(false)
    // })

    audioRef.current.addEventListener("timeupdate", setAudioTime)
    return function cleanup () {
      document.removeEventListener('timeUpdate', setAudioTime)
      document.removeEventListener('canplaythrough', setAudioData)
    }
  }, [])
  
  console.log(audioRef)
  return (
    <div className="w-full h-full flex flex-col px-10">
      <audio crossOrigin="use-credentials" preload='auto' ref={audioRef} id="audio">
        <source src={file.src} />
        Your browser does not support the <code>audio</code> element.
      </audio>

      <AudioVisualization 
        currentPercentage={currentPercentage}
      />

      <AudioControls 
        audioRef={audioRef}
        currentTime={curTime}
        handleCurrentTime={setCurTime}        
        duration={duration}
        currentPercentage={currentPercentage}
        handlePlaying={handlePlaying}
        isPlaying={isPlaying}
      />
    </div>
  )
}