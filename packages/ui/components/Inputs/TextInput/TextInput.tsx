/* eslint-disable react/jsx-props-no-spreading */
import { ComponentPropsWithoutRef, forwardRef } from "react";
import cn from 'classnames'
import style from './TextInput.module.css'

export const TextInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<"input">
>(({ ...props }, ref) => {

  return (
    <div className={cn(style.floatingLabelGroup)}>
      <input
        type="text"
        ref={ref}    
        style={{
          height: 36
        }}    
        className={cn(
          {
            [style.floatingInput]: true,
            [style.inputWithFocus]: props.value && props.value !== ''           
          },
          "text-sm sm:text-base w-full text-gray-500 hover:placeholder-gray-800 hover:border-gray-500 py-1 pr-2 pl-2"
        )}
        {...props}
        placeholder=' '
      />
      <div className={cn({
        [style.floatingLabelWrapper]: true,
        [style.labelWrapperWithFocus]: props.value && props.value !== '' 
      })}>
        <label className={cn({
          [style.floatingLabel]: true,
          [style.labelWithFocus]: props.value && props.value !== '' 
        })}>{ props.placeholder }</label>        
      </div>
    </div>
  );
});

TextInput.displayName = "TextInput";
