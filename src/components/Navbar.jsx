import ToggleTheme from "./ToggleTheme";
import Logo from "../assets/logo.svg";
import LogoLight from "../assets/logoLight.svg";
import { useState,useEffect } from "react";

export default function Navbar() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  });

  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  return (
    <>
      <div className="w-full h-20  flex justify-between items-center absolute top-0 z-50 left-0 bg-inherit px-4 md:px-8">
      <div className="flex items-center gap-2 justify-center">
      <img src={Logo} alt="Show icon" className="w-8 h-7  " />
        {/* { theme==='dark' ? (<img src={Logo} alt="Show icon" className="w-8 h-8 md:w-10 md:h-10" />) :
          (<img src={LogoLight} alt="Show icon" className="w-8 h-8 md:w-10 md:h-10" />)} */}
          <a
            href="/"
            className="text-2xl md:text-3xl font-extrabold  hover:text-opacity-80 select-none whitespace-nowrap"
          >
            DELTASAFE
          </a>
        </div>
        <ToggleTheme setTheme={setTheme} theme={theme} />
      </div>
    </>
  );
}
