/* eslint-disable react/jsx-props-no-spreading */
import { ComponentPropsWithoutRef, forwardRef } from "react";

export const TextInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<"input">
>(({ ...props }, ref) => {

  return (
    <div className="relative flex items-center justify-center">
      <input
        ref={ref}
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
        {...props}
      />
    </div>
  );
});

TextInput.defaultProps = {
  type: 'text'
}

TextInput.displayName = "TextInput";