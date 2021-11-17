import { FunctionComponent, Fragment, useState } from 'react'
import { createContext } from '../common/Context'
import cn from 'classnames'

type Props = {
  children: React.ReactNode
}

export const [toastContext, useToast] = createContext<(text: string) => void>()

export const ToastWrapper: FunctionComponent<Props> = ({ children }) => {

  const [showToast, toggleToast] = useState<boolean>(false)
  const [isFading, toggleFading] = useState<boolean>(false)
  const [toastText, handleToastText] = useState<string>('')

  const handleToast = (newToastText: string) => {
    handleToastText(newToastText)
    console.log('do the toast')
    toggleFading(false)
    toggleToast(true)

    const fadeToken = setTimeout(() => {
      toggleFading(true)
    }, 4000)

    const timeoutToken = setTimeout(() => {
      toggleToast(false)
    }, 5000)
  }
 
  return (
    <toastContext.Provider value={handleToast}>
      <Fragment>
        { children }
        { showToast && (
          <div 
            className={cn(
              'fixed shadow-md p-4 transition duration-500 bg-blue-600 text-white rounded w-48',
              {
                'opacity-100': !isFading,
                'opacity-0': isFading
              }
            )}
            style={{
              bottom: 15,
              right: 30             
            }}
          >
            { toastText }
          </div>
        )}
      </Fragment>
    </toastContext.Provider>
  )
}