import { MdSearch } from "react-icons/md";
import { ComponentPropsWithoutRef, forwardRef, useEffect, useRef, useState } from "react";
import cn from "classnames";

export const SearchInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<"input"> & { onSearch?: (value: string) => void }
>(({ onSearch, onChange, onKeyDown, ...props }, ref) => {
  const [inFocus, setFocus] = useState(false);
  const [inHover, setHover] = useState(false);

  const timer = useRef<ReturnType<typeof setTimeout>>(null)
  // Latest callback, so a debounced search uses the query of the latest render
  const onSearchRef = useRef(onSearch)
  onSearchRef.current = onSearch
  useEffect(() => () => clearTimeout(timer.current), [])

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
          font-sans
          font-semibold
          sm:text-base
          relative
          w-full
          border
          rounded
          border-gray-100
          placeholder-gray-300
          text-gray-300
          hover:placeholder-gray-800
          hover:border-gray-500
          focus:border-blue-300
          focus:outline-hidden
          py-1
          pr-2
          pl-9"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={(e) => {
          onChange?.(e)
          const value = e.target.value
          clearTimeout(timer.current)
          timer.current = setTimeout(() => onSearchRef.current?.(value), 500)
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e)
          if (e.key !== "Enter") return
          e.preventDefault()
          clearTimeout(timer.current)
          onSearchRef.current?.(e.currentTarget.value)
        }}
        {...props}
      />
    </div>
  );
});

SearchInput.displayName = "SearchInput";
