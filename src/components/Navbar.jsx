import React from 'react';
import Logo from '../assets/logo.svg'

export default function Navbar() {
  return (
    <>
    <div className='w-full h-24 flex  items-center absolute gap-80 top-0 z-50 left-0 bg-inherit '>
        <div className='select-none flex text-2xl gap-1 relative left-16 whitespace-nowrap items-center justify-center top-0 '>
        <img src={Logo} alt="Show icon" className="w-[30px] h-[30px]" />
            <a href="#" className='w-auto rounded-lg justify-center items-center h-10 mt-[0.5rem] font-extrabold hover:bg-transparent hover:text-white text-white'> DELTASAFE</a>
    {/* <a href="" className='bg-[#2e2e2e] rounded-2xl w-12 text-sm mt-1 ml-1 font-bold text-white border-[1px]'>v1.1</a> */}
        </div>
       
    </div>
    </>
  )
}
