import { FunctionComponent } from 'react'
import Img from 'next/image'
import logo from '../../assets/tella-logo.png'

export const LogoutPage: FunctionComponent = () => {

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white">
      <div className="p-10 bg-white rounded flex justify-center items-center flex-col shadow-md border">
        <div className='flex justify-center items-center py-4'>
          <Img src={logo} height="36px" alt="Tella logo"/>
        </div>
        <p className="text-xl text-gray-600 font-bold">Good bye</p>
        <p className='text-gray-600 py-4'>
          You have been successfully logged out from Tella Web.
        </p>
        <button
          className="bg-blue-300 hover:bg-blue py-2 text-white uppercase text-base font-bold rounded w-full disabled:opacity-50"
          id="logout"          
          type={"button"}
          onClick={() => {
            window.close()
          }}
        >
          <span>Close window</span>
        </button>
      </div>
    </div>    
  )
}