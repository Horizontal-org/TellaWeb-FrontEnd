import { FunctionComponent, useState, useEffect, useRef } from 'react'
import cn from 'classnames'
import { BsPlus } from "@react-icons/all-files/bs/BsPlus"
import { BsDash } from "@react-icons/all-files/bs/BsDash"
import { BsArrowsFullscreen } from "@react-icons/all-files/bs/BsArrowsFullscreen"

import { BsFillVolumeMuteFill } from "@react-icons/all-files/bs/BsFillVolumeMuteFill"
import { BsFillVolumeDownFill } from "@react-icons/all-files/bs/BsFillVolumeDownFill"
import { BsFillVolumeUpFill } from "@react-icons/all-files/bs/BsFillVolumeUpFill"
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
  
  const volumeRef = useRef<HTMLDivElement | null>(null)
  const [volumeIcon, handleVolumeIcon] = useState(null)

  const getVolumeIcon = () => {
    let icon = null
    if (muted || volumePercentage == 0) {
      icon = (<BsFillVolumeMuteFill size={20} color="#8B8E8F"/>)
    } else if (volumePercentage >= 50) {
      icon = (<BsFillVolumeUpFill size={20} color="#8B8E8F"/>)
    } else if (volumePercentage < 50) {
      icon = (<BsFillVolumeDownFill size={20} color="#8B8E8F"/>)
    }
    handleVolumeIcon(icon)
  }

  useEffect(() => {
    getVolumeIcon()
  }, [muted, volumePercentage])



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
          <div className='mr-2 flex items-center'>
            <div className='cursor-pointer pr-2' onClick={toggleMuted}>
              { volumeIcon }
            </div>
            <div className='relative' style={{width: 50}}>
              <div
                ref={volumeRef}
                className='bg-gray-200 w-full'
                style={{
                  height: 5,
                  borderRadius: 5 
                }}
              />
              <div
                style={{
                  width: volumePercentage + '%',
                  height: 5,
                  borderRadius: 5 
                }}
                className={cn(
                  'absolute top-0 left-0',
                  {
                    "w-gray-200": muted,
                    'bg-blue-300': !muted
                  }
                )}
              />
              <div
                className="w-full cursor-pointer bg-transparent absolute top-0"
                style={{ height: 4 }}
                onClick={(e) => { toggleVolume(volumeRef.current.getBoundingClientRect().left, e.clientX)} }
              >
            </div>
            </div>
          </div>
          { isVideo && (
            <div className='cursor-pointer ml-4' onClick={requestFullscreen}>
              <BsArrowsFullscreen color="#8B8E8F"/>
            </div>
          )}
      </div>
    </div>   
  )
}