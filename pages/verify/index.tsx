import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import axios from 'axios'
import Img from "next/image";
import logo from "../../packages/ui/assets/tella-sidelogo.png";



const Verify = () => {
  const router = useRouter()

  const { code } = router.query
  
  useEffect(() => {    
    const unblock = async(code) => {
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/unblock?code=${code}`)
        router.push('/login?verification_successful=1')
      } catch (e) {
        router.push('/login?verification_successful=0')
      }
    }

    unblock(code)
  }, [])
  
  return (
    <div
      className='flex justify-center items-center' 
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      <Img
        src={logo} 
        width="125px" 
        height="36px" 
        alt="Tella logo" 
      />
    </div>  
  );
};

export default Verify
