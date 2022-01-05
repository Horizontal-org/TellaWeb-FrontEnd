import { FunctionComponent  } from 'react'
import cn from 'classnames'
import { HiChevronLeft } from "@react-icons/all-files/hi/HiChevronLeft"
import { HiChevronRight } from "@react-icons/all-files/hi/HiChevronRight"

type Props = {
  gotoPage?: (index: number) => void
  previousPage: () => void
  nextPage: () => void
  canPreviousPage: boolean
  canNextPage: boolean
  pageIndex: number
  pageCount?: number
  pageTotal: number
}

export const Paginator: FunctionComponent<Props> = ({
  gotoPage,
  previousPage,
  nextPage,
  canPreviousPage,
  canNextPage,
  pageIndex,
  pageCount,
  pageTotal,
}) => {
  return (
    <div className='flex'>
      <button
        className='flex w-auto py-1 px-2 space-x-2 rounded-l items-center text-sm font-bold font-sans uppercase border border-gray-100 active:shadow-inbox' 
        onClick={() => previousPage()} disabled={!canPreviousPage}
      >
        <HiChevronLeft size={14} color={'#8B8D8E'} />
      </button>
      
      <div className='flex w-auto text-customgray-500 py-1 px-2 space-x-2 items-center text-sm font-bold font-sans uppercase border border-gray-100'>
        <strong>
        {(pageIndex + 1)} of {pageTotal}
        </strong>
      </div>
      
      <button 
        className='flex w-auto py-1 px-2 space-x-2 rounded-r items-center text-sm font-bold font-sans uppercase border border-gray-100 active:shadow-inbox'
        onClick={() => nextPage()} disabled={!canNextPage}
      >
        <HiChevronRight size={14} color={'#8B8D8E'} />
      </button>
      
    </div>
  )
}