// import { useState, useEffect } from 'react';
import Moon from '../assets/moon.svg';
import Sun from '../assets/sun.svg';
function ToggleTheme({setTheme,theme}) {
  
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      <button onClick={toggleTheme} className='rounded-full w-12 h-12 p-0 flex justify-center items-center bg-transparent hover:bg-[#eaeaea4a]'>
        {theme === 'light' ? <img src={Moon} alt="Copy icon" className="w-[24px] h-[24px] " /> : <img src={Sun} alt="Copy icon" className="w-[24px] h-[24px] " />}
      </button>
    </>
  );
}

export default ToggleTheme;
