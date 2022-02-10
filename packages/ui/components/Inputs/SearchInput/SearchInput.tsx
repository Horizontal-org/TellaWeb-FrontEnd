/* eslint-disable react/jsx-props-no-spreading */
import { MdSearch } from "react-icons/md";
import { ComponentPropsWithoutRef, forwardRef, useState } from "react";
import cn from "classnames";

export const SearchInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<"input">
>(({ ...props }, ref) => {
  const [inFocus, setFocus] = useState(false);
  const [inHover, setHover] = useState(false);

  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute flex border border-transparent left-0 top-0 h-full w-10 font-sans">
        <div
          className={cn(
            "flex items-center justify-center rounded-tl rounded-bl z-10 text-lg h-full w-full text-center",
            {
              "text-gray-400": !inFocus,
              "text-blue-300": inFocus,
              "text-gray-500": !inFocus && inHover,
            }
          )}
        >
          <MdSearch size={15} />
        </div>
      </div>
      <input
        type="text"
        ref={ref}
        placeholder="Search"
        style={{height: 36}}
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
          pl-9"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        {...props}
      />
    </div>
  );
});

SearchInput.displayName = "SearchInput";
