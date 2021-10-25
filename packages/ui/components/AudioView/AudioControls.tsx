import { useState, useEffect, useRef, FunctionComponent, MutableRefObject, Dispatch, SetStateAction } from 'react'
import moment from 'moment'

type Props = {
  audioRef: MutableRefObject<HTMLAudioElement | null>
  currentTime: number
  handleCurrentTime: Dispatch<SetStateAction<number>>
  duration: number,
  currentPercentage: number,
  handlePlaying:  Dispatch<SetStateAction<boolean>>
  isPlaying: boolean
}

export const AudioControls: FunctionComponent<Props> = ({
  audioRef, 
  currentTime, 
  handleCurrentTime,
  duration,
  currentPercentage,
  isPlaying,
  handlePlaying
}) => {
  const progressRef = useRef<HTMLDivElement | null>(null)
  const currentProgressRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className="w-full">
      <div>
        <div className="flex justify-center">
          <div className="w-10 h-10 flex justify-center items-center">
            { isPlaying ? (
              <div
                className="cursor-pointer" 
                onClick={() => {
                  handlePlaying(false)
                  audioRef.current.pause()
                }}
              >
                <svg stroke="currentColor" fill="#8B8E8F" strokeWidth="0" viewBox="0 0 512 512" height="30" width="30" xmlns="http://www.w3.org/2000/svg"><path d="M96 448h106.7V64H96v384zM309.3 64v384H416V64H309.3z"></path></svg>
              </div>
            ) : (
              <div 
                className="cursor-pointer" 
                onClick={() => {
                  handlePlaying(true)
                  audioRef.current.play()
                }}
              >
                <svg width="40" height="40" viewBox="0 0 43 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.5162 14.208C15.5162 13.8212 15.9366 13.5809 16.2699 13.7771L26.107 19.5692C26.4355 19.7625 26.4355 20.2375 26.107 20.4309L16.2699 26.2229C15.9366 26.4192 15.5162 26.1789 15.5162 25.7921V20V14.208ZM13.6633 8.79613C13.3302 8.59326 12.9033 8.8331 12.9033 9.2232V30.7769C12.9033 31.167 13.3302 31.4068 13.6633 31.204L31.3632 20.4271C31.6832 20.2323 31.6832 19.7678 31.3632 19.573L13.6633 8.79613Z" fill="#8B8E8F"/>
                </svg>
              </div>
            )}
          </div>          
        </div>


        <div className='flex items-center'>
          <div className='p-4 text-gray-500 text-sm'>
            { currentTime ? moment(currentTime, 'ss').format('mm:ss') : '00:00' }
          </div>
          <div className="w-full relative">
            <div
              ref={progressRef}
              className="w-full bg-gray-200"
              style={{
                height: 4
              }}
            >
            </div>

            <div
              ref={currentProgressRef}
              className="bg-blue-300 absolute top-0"
              style={{
                height: 4,
                width: `${currentPercentage}%` || 0
              }}
            >
            </div>

            <div
              className="w-full cursor-pointer bg-transparent absolute top-0"
              style={{
                height: 4,
              }}
              onClick={(e) => {
                const start = progressRef.current.getBoundingClientRect().left
                const durationInPixels = e.clientX - start
                const timePerPixel = duration / progressRef.current.clientWidth
                const clickedTime = Math.floor(timePerPixel * durationInPixels)
                handlePlaying(true)
                handleCurrentTime(clickedTime)
                audioRef.current.pause()
                audioRef.current.currentTime = clickedTime
                audioRef.current.play()
              }}
            >
            </div>
          </div>
          <div className='p-4 text-gray-500 text-sm'>
            { duration ? moment(duration, 'ss').format('mm:ss') : '00:00' }
          </div>
        </div>
      
      </div>
    </div>
  )
}