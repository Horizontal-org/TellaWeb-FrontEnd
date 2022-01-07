import { useEffect, useState, FunctionComponent, MutableRefObject } from 'react'
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
  const [volume, handleVolume] = useState<number>(0)
  const [currentFileRef, handleCurrentRef] = useState<HTMLVideoElement | HTMLAudioElement>(null)
  const [parsedDuration, handleParsedDuration] = useState<string>()
  const [parsedCurrentTime, handleParsedCurrentTime] = useState<string>()

  const getParsedTime = (time) => {
    const minutes = Math.floor(time / 60)    
    const seconds = Math.floor(time - minutes * 60)
    let parsedTime = (minutes + '').length === 1 ? `0${minutes}` : minutes
    parsedTime = parsedTime + ':'
    parsedTime = parsedTime + ((seconds + '').length === 1 ? `0${seconds}` : seconds)
    return parsedTime
  }

  const setTime = () => {
    handleParsedDuration(getParsedTime(fileRef.current.duration))
    handleParsedCurrentTime(getParsedTime(fileRef.current.currentTime))
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
    fileRef.current.currentTime = 0
    setData()    
    handleVolume(0)

  }, [fileRef.current])

  if (!currentFileRef) return null

  return (
    <div className="w-full py-4 pt-16">
      <div>
        <MediaButtons
          isVideo={isVideo}
          isPlaying={isPlaying}
          muted={isMuted}
          volume={volume}
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
          toggleVolume={(newVolume: number) => {
            if (newVolume > 0 && currentFileRef.muted) {
              currentFileRef.muted = false
              handleMuted(false)
            }

            handleVolume(newVolume)
            currentFileRef.volume = newVolume / 10
          }}
        />

        <MediaProgressBar 
          parsedCurrentTime={parsedCurrentTime}
          parsedDuration={parsedDuration}
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