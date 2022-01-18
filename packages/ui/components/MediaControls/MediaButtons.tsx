import { FunctionComponent } from 'react'
import { MediaVolume } from './MediaVolume'
import { BsPlay } from 'react-icons/bs'
import { MdFullscreen } from "react-icons/md"

import ForwardTen from './Icons/ForwardTen'
import RewindTen from './Icons/RewindTen'

type Props = {
  play: () => void
  pause: () => void
  isPlaying: boolean
  isVideo: boolean
  addTen: () => void
  subTen: () => void
  requestFullscreen: () => void
  volume: number
  muted: boolean  
  toggleMuted: () => void
  toggleVolume: (volume: number) => void
}

export const MediaButtons: FunctionComponent<Props> = ({
  play,
  pause,
  isVideo,
  isPlaying,
  addTen,
  subTen,
  requestFullscreen,
  volume,
  muted,
  toggleMuted,
  toggleVolume
}) => {

  return (
    <div className="h-10 relative flex  ` items-center justify-between"> 

      <div>
        <MediaVolume 
          volume={volume}
          muted={muted}
          toggleMuted={toggleMuted}
          toggleVolume={toggleVolume}
        />
      </div>

      <div className='flex items-center'>
        <div className='cursor-pointer '>
          <div onClick={subTen}  className='p-2 flex items-center text-gray-600'>
            <RewindTen />
          </div>
        </div>
        <div className='w-20 flex justify-center'>
          { isPlaying ? (
            <div
              className="cursor-pointer" 
              onClick={pause}
            >
              <svg stroke="currentColor" fill="#8B8E8F" strokeWidth="0" viewBox="0 0 512 512" height="30" width="30" xmlns="http://www.w3.org/2000/svg"><path d="M96 448h106.7V64H96v384zM309.3 64v384H416V64H309.3z"></path></svg>
            </div>
          ) : (
            <div 
              className="cursor-pointer" 
              onClick={play}
            >          
              <BsPlay color="#8B8E8F" size={40}/>
            </div>
          )}
        </div>
        <div className='cursor-pointer'>
          <div onClick={addTen}  className='p-2 flex items-center text-gray-600'>
            <ForwardTen />    
          </div>
        </div>
      </div>

      <div className='h-10 flex items-center'>        
        { isVideo && (
          <div className='cursor-pointer ml-4' onClick={requestFullscreen}>
            <MdFullscreen size={30} color="#8B8E8F"/>
          </div>
        )}
      </div>
    </div>   
  )
}