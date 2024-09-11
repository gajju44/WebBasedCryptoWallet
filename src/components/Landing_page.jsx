import React from 'react'
import { useNavigate } from 'react-router-dom';
function Landing_page() {

  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/CreateWallet");
  };
  
  return (
   <>
     <div className='h-screen w-full flex justify-center items-center'>
            
            
            <div className="absolute bottom-[-200px] left-[-30] z-0   bg-gradient-to-r from-[#ff00d9]  to-[#2e39ff] opacity-100 blur-[90px] rounded-full w-[130%] h-[400px]" />
            <div className="relative bottom-[-260px] left-0 z-10 animate-slide-right bg-[#ff85ed]  will-change-auto  opacity-80 blur-[90px]  w-[2000px] h-[100px]" />
            <div className="relative bottom-[-260px] left-0 z-10 animate-slide-left bg-[#00f7ff] will-change-auto  opacity-80 blur-[90px]  w-[2000px] h-[100px]" />
           <div className='flex flex-col absolute  top-32 items-center gap-10'>
            <h1 className="text-7xl w-[730px] text-center font-semibold  ">Bridging the Gap Between You and Your Digital Wealth</h1>

           <div className='flex gap-3 items-center'>
           <button className='w-fit' onClick={handleRedirect}>Etherium</button> 
            <button className='w-fit ' onClick={handleRedirect}>Solana</button>
          
           </div> 

            </div>
        
     </div>   
   </>
  )
}

export default Landing_page
