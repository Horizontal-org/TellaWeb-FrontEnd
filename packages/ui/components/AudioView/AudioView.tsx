import { FunctionComponent, useState, useEffect, useRef } from 'react'
import { IReportFile } from '../../domain/ReportFile'
import { MediaControls } from '../MediaControls/MediaControls';
import { AudioVisualization } from './AudioVisualization'

type Props = {
  file: IReportFile
};

export const AudioView: FunctionComponent<Props> = ({file}) => {
  const [canPlay, handleCanPlay] = useState<boolean>(false)
  const [currentPercentage, handlePercentage] = useState<number>(0)
  const fileRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (!fileRef) {
      return
    }

    const handleTimeUpdateListener = () => {
      handlePercentage((fileRef.current.currentTime / fileRef.current.duration) * 100)
    }

    const handleCanPlayListener = () => {
      handleCanPlay(true)
    }

    fileRef.current.addEventListener('canplay', handleCanPlayListener)

    fileRef.current.addEventListener("timeupdate", handleTimeUpdateListener)

    return function cleanup () {
      document.removeEventListener('timeupdate', handleTimeUpdateListener)
      document.removeEventListener('canplay', handleCanPlayListener)
    }
  }, [])

  useEffect(() => {
    fileRef.current.load()
  }, [file.src])
  
  return (
    <div className="w-full h-full flex flex-col items-center px-10">
      <audio crossOrigin="use-credentials" ref={fileRef} id="audio">
        <source src={file.src} />
        Your browser does not support the <code>audio</code> element.
      </audio>

      { fileRef.current && (
        <div          
          style={{
            width: '40vw'
          }}
        >
          <AudioVisualization 
            currentPercentage={`${currentPercentage}` || '0'}
          />
        </div>
      )}

      <div className='w-full flex justify-center'>
        <div  style={{ width: '40vw'}}>
          <MediaControls 
            isVideo={false}
            fileRef={fileRef}
          />
        </div>
      </div>


    </div>
  )
}