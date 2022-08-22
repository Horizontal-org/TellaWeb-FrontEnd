import { FunctionComponent  } from 'react'
import cn from 'classnames'
import { HiChevronLeft } from "react-icons/hi"
import { HiChevronRight } from "react-icons/hi"

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

export const Paginator: FunctionComponent<React.PropsWithChildren<Props>> = ({
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
        style={{ height: 38 }}
        className='flex w-auto py-1 px-2 space-x-2 rounded-l items-center text-sm font-bold font-sans uppercase border border-gray-100 active:shadow-inbox hover:bg-gray-50' 
        onClick={() => previousPage()} disabled={!canPreviousPage}
      >
        <HiChevronLeft size={20} color={'#8B8D8E'} />
      </button>
      
      <div 
        className='flex w-auto text-customgray-500 py-1 px-2 space-x-2 items-center text-sm font-bold font-sans uppercase border border-gray-100'
        style={{ height: 38 }}
      >
        <strong>
        {(pageIndex + 1)} of {pageTotal > 0 ? pageTotal : 1}
        </strong>
      </div>
      
      <button 
        className='flex w-auto py-1 px-2 space-x-2 rounded-r items-center text-sm font-bold font-sans uppercase border border-gray-100 active:shadow-inbox hover:bg-gray-50'
        onClick={() => nextPage()} disabled={!canNextPage}
        style={{ height: 38 }}
      >
        <HiChevronRight size={20} color={'#8B8D8E'} />
      </button>
      
    </div>
  )
}