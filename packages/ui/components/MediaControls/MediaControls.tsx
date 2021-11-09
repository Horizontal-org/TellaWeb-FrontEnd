import { useRef, useEffect, useState, FunctionComponent, MutableRefObject } from 'react'
import moment from 'moment'
import { MediaButtons } from './MediaButtons'
import { MediaProgressBar } from './MediaProgressBar'

type Props = {
  fileRef: MutableRefObject<HTMLAudioElement | HTMLVideoElement>
  isVideo: boolean
}

export const MediaControls: FunctionComponent<Props> = ({
  fileRef,
  isVideo
}) => {
  const [isPlaying, handlePlaying] = useState<boolean>(false)
  const [isMuted, handleMuted] = useState<boolean>(false)
  const [volumePercentage, handleVolumePercentage] = useState<number>(0)
  const [currentFileRef, handleCurrentRef] = useState<HTMLVideoElement | HTMLAudioElement>(null)
  const [momentDuration, handleMomentDuration] = useState<moment.Duration>()
  const [momentCurrentTime, handleMomentCurrentTime] = useState<moment.Duration>()

  const setTime = () => {
    handleMomentDuration(moment.duration(fileRef.current.duration, 'seconds'))
    handleMomentCurrentTime(moment.duration(fileRef.current.currentTime, 'seconds'))
  }

  const setData = () => {
    setTime()
    handleCurrentRef(fileRef.current)
    fileRef.current.volume = 0
  }
  
  const restartData = () => {
    fileRef.current.currentTime = 0
    handlePlaying(false)
  }

  useEffect(() => {

    fileRef.current.addEventListener("loadeddata", setData)

    fileRef.current.addEventListener("ended", restartData)

    fileRef.current.addEventListener("timeupdate", setTime)

    return function cleanup () {
      document.removeEventListener('timeupdate', setTime)
      document.removeEventListener('loadeddata', setData)
      document.removeEventListener('ended', restartData)
    }
  }, [])

  useEffect(() => {
    console.log('fileref current')
    fileRef.current.currentTime = 0
    setData()    
    handleVolumePercentage(0)

  }, [fileRef.current])

  if (!currentFileRef) return null

  return (
    <div className="w-full py-4">
      <div>
        <MediaButtons
          isVideo={isVideo}
          isPlaying={isPlaying}
          muted={isMuted}
          volumePercentage={volumePercentage}
          addTen={() => { currentFileRef.currentTime += 10 }}
          subTen={() => { currentFileRef.currentTime -= 10 }}
          play={() => {
            handlePlaying(true)
            currentFileRef.play()            
          }}
          pause={() => {
            handlePlaying(false)
            currentFileRef.pause()            
          }}
          requestFullscreen={() => {
            if (currentFileRef.requestFullscreen) {
              currentFileRef.requestFullscreen()
            }
          }}
          toggleMuted={() => {            
            currentFileRef.muted = !currentFileRef.muted
            handleMuted(currentFileRef.muted)
          }}
          toggleVolume={(clientRectLeft: number, clientX: number) => {
            const newVolume = ((clientX - clientRectLeft) / 50) * 100
            handleVolumePercentage(newVolume)
            currentFileRef.volume = newVolume / 100
          }}
        />

        <MediaProgressBar 
          momentCurrentTime={momentCurrentTime}
          momentDuration={momentDuration}
          percentage={`${(currentFileRef.currentTime / currentFileRef.duration) * 100}%` || '0'}
          onBarClick={(e, clientRectLeft, clientWidth) => {
            const start = clientRectLeft
            const durationInPixels = e.clientX - start
            const timePerPixel = currentFileRef.duration / clientWidth
            const clickedTime = Math.floor(timePerPixel * durationInPixels)
            handlePlaying(true)
            currentFileRef.pause()
            currentFileRef.currentTime = clickedTime
            currentFileRef.play()
          }}
        />        
      
      </div>
    </div>
  )
}