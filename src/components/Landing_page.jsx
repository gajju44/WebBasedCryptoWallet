import { useNavigate } from "react-router-dom";
import ParticlesComponent from "./ParticlesComponent";
import Navbar from "./Navbar";

function Landing_page() {
  const navigate = useNavigate();

  const handleRedirect = (path, props) => {
    navigate(path, { state: props });
  };

  return (
    <>
      <div className="h-screen w-screen overflow-hidden  flex absolute left-0 top-0 justify-center items-center">
        <Navbar />
        <ParticlesComponent />
        <div className="absolute bottom-[-200px] left-0 z-0   bg-gradient-to-r from-[#ff00d9]  to-[#2e39ff] opacity-100 blur-[90px] rounded-full w-[130%] h-[350px]" />
        <div className="absolute bottom-1  left-0 z-10 animate-slide-right bg-[#ff85ed]  will-change-auto  opacity-80 blur-[90px]  w-[2000px] h-[90px]" />
        <div className="absolute bottom-1 left-0 z-10 animate-slide-left bg-[#00f7ff] will-change-auto  opacity-80 blur-[90px]  w-[2000px] h-[90px]" />
        <div className="flex flex-col absolute  top-48 items-center gap-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl w-[90%] md:w-[730px] text-center font-bold select-none ">
            Bridging the Gap Between You and Your Digital Wealth
          </h1>

          <div className="flex flex-wrap gap-3 items-center">
          <button
              className="w-fit select-none z-50"
              onClick={() =>
                handleRedirect("/CreateWallet", { DerivationPath: "m/44/0/0" })
              }
            >
              Bitcoin
            </button>

            <button
              className="w-fit select-none z-50"
              onClick={() =>
                handleRedirect("/CreateWallet", { DerivationPath: "m/44/60/0" })
              }
            >
              Etherium
            </button>

            <button
              className="w-fit select-none z-50"
              onClick={() =>
                handleRedirect("/CreateWallet", {
                  DerivationPath: "m/44/501/0",
                })
              }
            >
              Solana
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Landing_page;
