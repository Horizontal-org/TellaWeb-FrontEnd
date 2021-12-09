import { FunctionComponent, Fragment, useState } from 'react'
import { createContext } from '../common/Context'
import cn from 'classnames'
import { BsX } from "@react-icons/all-files/bs/BsX"
import { AiOutlineInfoCircle } from "@react-icons/all-files/ai/AiOutlineInfoCircle"
import { IoMdCheckmarkCircleOutline } from "@react-icons/all-files/io/IoMdCheckmarkCircleOutline"

type Props = {
  children: React.ReactNode
}

export const [toastContext, useToast] = createContext<(text: string, type?: string) => void>()

export const ToastWrapper: FunctionComponent<Props> = ({ children }) => {

  const [showToast, toggleToast] = useState<boolean>(false)
  const [isFading, toggleFading] = useState<boolean>(false)
  const [toastText, handleToastText] = useState<string>('')
  const [toastType, handleType] = useState<string>('')

  const handleToast = (newToastText: string, type?: string) => {
    handleToastText(newToastText)
    handleType(type || 'info')
    toggleFading(false)
    toggleToast(true)

    setTimeout(() => {
      toggleFading(true)
    }, 4000)

    setTimeout(() => {
      toggleToast(false)
    }, 5000)
  }
 
  const clearToast = () => {
    toggleFading(true)
    setTimeout(() => {
      toggleToast(false)
    }, 1000)
  }

  const getToastIcon = () => {
    if (toastType === 'info' || toastType === 'danger') {      
      return (<AiOutlineInfoCircle color='white' size={20}/>)
    } else if (toastType === 'success') {
      return (<IoMdCheckmarkCircleOutline color='white' size={20}/>)
    }
  }


  return (
    <toastContext.Provider value={handleToast}>
      <Fragment>
        { children }
        { showToast && (
          <div 
            className={cn(
              'fixed shadow-md p-2 transition text-sm font-bold font-sans duration-300 text-white rounded',
              {
                'opacity-100': !isFading,
                'opacity-0': isFading,
                'bg-blue-300': toastType === 'info',
                'bg-red-600': toastType === 'danger',
                'bg-green-600': toastType === 'success',
              }
            )}
            style={{
              bottom: 15,
              right: 30,
              minWidth: '20rem'
            }}
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                { getToastIcon() }
                <span className='pl-2'>{ toastText }</span>
              </div>
              <div className='cursor-pointer' onClick={clearToast}>
                <BsX color='white' size={20} /> 
              </div>
            </div>
          </div>
        )}
      </Fragment>
    </toastContext.Provider>
  )
}