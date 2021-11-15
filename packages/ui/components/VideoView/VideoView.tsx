import { FunctionComponent, useState, useEffect, useRef } from 'react'
import { IReportFile } from '../../domain/ReportFile'
import { MediaControls } from '../MediaControls/MediaControls'
import { VideoLoading } from './VideoLoading';

type Props = {
  file: IReportFile
};

export const VideoView: FunctionComponent<Props> = ({file}) => {
  const [canPlay, handleCanPlay] = useState<boolean>(false)
  const fileRef = useRef<HTMLVideoElement | null>(null)

  const listenerCanPlay = () => {
    handleCanPlay(true)
  }

  useEffect(() => {
    if (!fileRef) {
      return
    }

    fileRef.current.addEventListener('canplay', listenerCanPlay)

    return function cleanup () {
      document.removeEventListener('canplay', listenerCanPlay)      
    }
  }, [])

  useEffect(() => {
    handleCanPlay(false) 
    fileRef.current.load()

    fileRef.current.addEventListener('canplay', listenerCanPlay)

    return function cleanup () {
      document.removeEventListener('canplay', listenerCanPlay)      
    }
  }, [file.src])

  const getFileType = () => {
    const type = file.fileName.split('.')[1]
    return `video/${type || 'mp4'}`
  }


  return (
    <div className=" w-full h-full flex flex-col items-center px-10">
      <div 
        className='relative flex justify-center items-center'     
        style={{
          width: '40vw',
        }}    
      >
        <video 
          className={'w-full'}
          ref={fileRef} 
          id={`${file.fileName}-video`}
          key={file.src}
        >
          <source src={file.src} key={file.src} type={getFileType()}/>
          Your browser does not support the <code>video</code> element.
        </video>

        { !canPlay && (
          <div>
            <VideoLoading />
          </div>
        )}
       
      </div>  

      { canPlay && (
        <div className='w-full flex justify-center'>
          <div  style={{ width: '40vw'}}>
            <MediaControls 
              isVideo={true}
              fileRef={fileRef}
            />
          </div>
        </div>
      )}

    </div>
  )
}