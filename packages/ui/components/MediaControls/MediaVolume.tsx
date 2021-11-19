import { FunctionComponent, useRef } from 'react'
import { BsFillVolumeMuteFill } from "@react-icons/all-files/bs/BsFillVolumeMuteFill"
import { BsFillVolumeDownFill } from "@react-icons/all-files/bs/BsFillVolumeDownFill"
import { BsFillVolumeUpFill } from "@react-icons/all-files/bs/BsFillVolumeUpFill"
import cn from 'classnames'
import { IconContext } from '@react-icons/all-files/lib'

type Props = {
  muted: boolean
  volumePercentage: number
  toggleMuted: () => void
  toggleVolume: (clientRectLeft: number, clientX: number) => void
}

export const MediaVolume: FunctionComponent<Props> = ({
  muted,
  volumePercentage,
  toggleMuted,
  toggleVolume
}) => {
  const volumeRef = useRef<HTMLDivElement | null>(null)

  const getVolumeIcon = () => {
    let icon = null
    if (muted || volumePercentage == 0) {
      icon = (<BsFillVolumeMuteFill size={20} color="#8B8E8F"/>)
    } else if (volumePercentage >= 50) {
      icon = (<BsFillVolumeUpFill size={20} color="#8B8E8F"/>)
    } else if (volumePercentage < 50) {
      icon = (<BsFillVolumeDownFill size={20} color="#8B8E8F"/>)
    }
    return icon
  }

  return (
    <div className='mr-2 flex items-center'>
      <div className='cursor-pointer pr-2' onClick={toggleMuted}>
        { getVolumeIcon() }
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
  )
}