import { FunctionComponent, useRef, useState, useEffect } from 'react'
import { BsFillVolumeUpFill, BsFillVolumeDownFill, BsFillVolumeMuteFill } from "react-icons/bs"

type Props = {
  muted: boolean
  volume: number
  toggleMuted: () => void
  toggleVolume: (volume: number) => void
}

export const MediaVolume: FunctionComponent<Props> = ({
  muted,
  volume,
  toggleMuted,
  toggleVolume
}) => {

  const getVolumeIcon = () => {
    let icon = null
    if (muted || volume == 0) {
      icon = (<BsFillVolumeMuteFill size={30} color="#8B8E8F"/>)
    } else if (volume >= 5) {
      icon = (<BsFillVolumeUpFill size={30} color="#8B8E8F"/>)
    } else if (volume < 5) {
      icon = (<BsFillVolumeDownFill size={30} color="#8B8E8F"/>)
    }
    return icon
  }

  return (
    <div className='mr-2 flex items-center relative'>
      <div className='group'>
        <div className='cursor-pointer pr-2' onClick={toggleMuted}>
          { getVolumeIcon() }
        </div>
        <div 
          className='absolute hidden group-hover:flex'
          style={{
            zIndex: 2,
            top: -50,
            left: -10,
            width: 50,
            height: 50
          }}
        >
          <div 
            className='flex justify-center'
            style={{
              transform: 'rotate(270deg)'
            }}
          >
            <input 
              style={{width: 50}}
              id="typeinp" 
              type="range" 
              min="0" max="10" 
              value={volume} 
              onChange={(e) => { 
                toggleVolume(parseInt(e.target.value))
               }}
              step="1"
            />
          </div>
        </div>
      </div>
    </div>
  )
}