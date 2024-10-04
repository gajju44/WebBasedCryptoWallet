
import Logo from "../assets/logo.svg";

export default function Navbar() {
  return (
    <>
      <div className="w-full h-20  flex  items-center absolute top-0 z-50 left-0 bg-inherit px-4 md:px-8">
      <div className="flex items-center gap-2 justify-center">
          <img src={Logo} alt="Show icon" className="w-8 h-8 md:w-10 md:h-10" />
          <a
            href="/"
            className="text-2xl md:text-3xl font-extrabold text-white hover:text-opacity-80 select-none whitespace-nowrap"
          >
            DELTASAFE
          </a>
        </div>
      </div>
    </>
  );
}
