import { forwardRef, ComponentPropsWithoutRef } from 'react'

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  ComponentPropsWithoutRef<"textarea">
>(({ ...props }, ref) => {

  return (
    <textarea 
      style={{
        minHeight: 120
      }}
      className="
          text-sm
          sm:text-base
          relative
          w-full
          border
          rounded
          border-gray-100
          placeholder-gray-300
          text-gray-500
          hover:placeholder-gray-800
          hover:border-gray-500
          focus:border-blue-300
          focus:outline-none
          py-1
          pr-2
          pl-2"
      ref={ref}
      {...props}
    />
  )
})

TextArea.displayName = "TextArea";