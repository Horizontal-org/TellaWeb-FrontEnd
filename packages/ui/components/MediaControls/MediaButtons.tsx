import { FunctionComponent } from 'react'
import { MediaVolume } from './MediaVolume'
import { BsPlus } from "@react-icons/all-files/bs/BsPlus"
import { BsDash } from "@react-icons/all-files/bs/BsDash"
import { BsArrowsFullscreen } from "@react-icons/all-files/bs/BsArrowsFullscreen"
import { BsPlay } from "@react-icons/all-files/bs/BsPlay"

type Props = {
  play: () => void
  pause: () => void
  isPlaying: boolean
  isVideo: boolean
  addTen: () => void
  subTen: () => void
  requestFullscreen: () => void
  volumePercentage: number
  muted: boolean  
  toggleMuted: () => void
  toggleVolume: (clientRectLeft: number, clientX: number) => void
}

export const MediaButtons: FunctionComponent<Props> = ({
  play,
  pause,
  isVideo,
  isPlaying,
  addTen,
  subTen,
  requestFullscreen,
  volumePercentage,
  muted,
  toggleMuted,
  toggleVolume
}) => {

  return (
    <div className="h-10 relative flex justify-center items-center"> 
      <div className='cursor-pointer '>
        <div onClick={subTen}  className='p-2 flex items-center text-gray-600'>
          <BsDash />
          <span>10</span>      
        </div>
      </div>
      <div className='w-24 flex justify-center'>
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
          <BsPlus />
          <span>10</span>          
        </div>
      </div>
      <div className='h-10 absolute right-0 top-0 flex items-center'>
        <MediaVolume 
          volumePercentage={volumePercentage}
          muted={muted}
          toggleMuted={toggleMuted}
          toggleVolume={toggleVolume}
        />
        { isVideo && (
          <div className='cursor-pointer ml-4' onClick={requestFullscreen}>
            <BsArrowsFullscreen color="#8B8E8F"/>
          </div>
        )}
      </div>
    </div>   
  )
}