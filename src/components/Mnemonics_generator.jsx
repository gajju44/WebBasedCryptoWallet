import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { generateMnemonic, validateMnemonic } from "bip39";
import Solana from "./Solana";
import Ethereum from "./Ethereum";
import { ToastContainer, toast } from "react-toastify";
import { Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";

import Copy from "../assets/copy.svg";
import DownArrow from "../assets/down_arrow.svg";
import UpArrow from "../assets/up_arrow.svg";

export default function MnemonicsGen() {
  const [Solmnemonic, setSolMnemonic] = useState("");
  const [ETHmnemonic, setETHMnemonic] = useState("");
  const [individualMnemonic, setIndividualMnemonic] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const [customMnemonic, setCustomMnemonic] = useState("");
  const [IsDropDown, setIsDropDown] = useState(false);

  const location = useLocation();
  const { DerivationPath } = location.state || {};

  // Load mnemonic from local storage based on DerivationPath
  useEffect(() => {
    if (DerivationPath === "m/44/60/0") {
      const storedETHMnemonic = localStorage.getItem("ETHmnemonic");
      if (storedETHMnemonic) {
        setETHMnemonic(storedETHMnemonic);
        setIndividualMnemonic(storedETHMnemonic.split(" "));
        setIsClicked(true);
      }
    } else if (DerivationPath === "m/44/501/0") {
      const storedSolMnemonic = localStorage.getItem("Solmnemonic");
      if (storedSolMnemonic) {
        setSolMnemonic(storedSolMnemonic);
        setIndividualMnemonic(storedSolMnemonic.split(" "));
        setIsClicked(true);
      }
    }
  }, [DerivationPath]);

  // Save mnemonic to local storage whenever it changes
  useEffect(() => {
    if (ETHmnemonic && DerivationPath === "m/44/60/0") {
      localStorage.setItem("ETHmnemonic", ETHmnemonic);
    } else if (Solmnemonic && DerivationPath === "m/44/501/0") {
      localStorage.setItem("Solmnemonic", Solmnemonic);
    }
  }, [ETHmnemonic, Solmnemonic, DerivationPath]);

  const handleDropDown = () => {
    setIsDropDown(!IsDropDown);
  };

  const GenerateMnemonic = () => {
    const mnemonicString = generateMnemonic();
    if (DerivationPath === "m/44/60/0") {
      setETHMnemonic(mnemonicString);
    } else if (DerivationPath === "m/44/501/0") {
      setSolMnemonic(mnemonicString);
    }
    setIndividualMnemonic(mnemonicString.split(" "));
    setIsClicked(true);
    toast.success("Mnemonic Generated!", { containerId: "mnemonicsToast" });
  };

  const handleCustomMnemonicChange = (e) => {
    setCustomMnemonic(e.target.value);
  };

  const CopyToClipBoard = async (passedVar) => {
    if (passedVar) {
      await navigator.clipboard.writeText(passedVar);
      toast.success("Copied to clipboard!", { containerId: "mnemonicsToast" });
    }
  };

  const handleUseCustomMnemonic = () => {
    if (validateMnemonic(customMnemonic)) {
      if (DerivationPath === "m/44/60/0") {
        setETHMnemonic(customMnemonic);
      } else if (DerivationPath === "m/44/501/0") {
        setSolMnemonic(customMnemonic);
      }
      setIndividualMnemonic(customMnemonic.split(" "));
      setIsClicked(true);
    } else {
      alert("Invalid mnemonic. Please enter a valid 12 or 24-word mnemonic.");
    }
  };

  const handleClearMnemonic = () => {
    if (DerivationPath === "m/44/60/0") {
      setETHMnemonic(""); // Clear ETH state
      localStorage.removeItem("ETHmnemonic"); // Clear ETH from localStorage
    } else if (DerivationPath === "m/44/501/0") {
      setSolMnemonic(""); // Clear Sol state
      localStorage.removeItem("Solmnemonic"); // Clear Sol from localStorage
    }
    setIndividualMnemonic([]); // Clear individual mnemonic array
    setIsClicked(false); // Reset button visibility
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
        closeButton={false}
        containerId="mnemonicsToast"
      />
     
      <div className="h-screen overflow-x-hidden w-screen absolute top-0 pt-24 left-0 mb-6 flex flex-col items-center gap-5 py-11">
      <Navbar />
        <div className="select-none flex flex-col relative left-0 w-[90.3%] h-auto p-4 bg-[#111111] border-[0.5px] border-[#2b2b2b] rounded-md">
          <span
            onClick={handleDropDown}
            className="flex justify-between p-3 items-center"
          >
            <span className="text-2xl font-bold whitespace-nowrap">
              Your Wallet's Seed
            </span>
            <button
              onClick={GenerateMnemonic}
              className={`w-fit ${isClicked ? "hidden" : ""}`}
            >
              Generate New
            </button>
            <button
              onClick={handleDropDown}
              className={`w-fit bg-inherit p-2 rounded-full hover:border-none hover:bg-[#99999948] ${
                isClicked ? "" : "hidden"
              }`}
            >
              {IsDropDown ? (
                <img src={UpArrow} alt="hide" className="w-[24px] h-[24px]" />
              ) : (
                <img src={DownArrow} alt="show" className="w-[24px] h-[24px]" />
              )}
            </button>
          </span>

          <div
            id="mnemonicsshow"
            onClick={() =>
              CopyToClipBoard(
                DerivationPath === "m/44/60/0" ? ETHmnemonic : Solmnemonic
              )
            }
            className={`will-change-auto cursor-pointer overflow-hidden mt-5 gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 m-1 bg-inherit transition-all duration-700 ease-in-out rounded-xl ${
              IsDropDown ? "max-h-0 opacity-0" : "max-h-max opacity-100"
            }`}
          >
            {individualMnemonic.map((mnemonic, index) => (
              <button
                key={index}
                className="gap-4 items-center justify-center flex pointer-events-none"
              >
                {mnemonic}
              </button>
            ))}
           
          </div>
          <span
              className={`flex mt-6 text-[#868686]  items-center gap-1 ${
                isClicked ? "" : "hidden"
              }`}
            >
              {" "}
              <img src={Copy} alt="Copy icon" className="w-[24px] h-[24px] " />
              Click Anywhere To Copy{" "}
            </span>

          <div className={`flex flex-col mt-5 ${isClicked ? "hidden" : ""}`}>
            <span className="text-xl font-bold">
              Or Recover with Existing Mnemonic:
            </span>
            <input
              type="text"
              className="p-3 mt-2 bg-[#222222] text-white rounded-md"
              rows={4}
              placeholder="Enter your 12 or 24-word mnemonic here..."
              value={customMnemonic}
              onChange={handleCustomMnemonicChange}
            />
            <button onClick={handleUseCustomMnemonic} className="mt-3">
              Use Existing Mnemonic
            </button>
          </div>
        </div>

        {DerivationPath === "m/44/501/0" ? (
          <div className="w-[90.3%] flex justify-center flex-col">
            <Solana
              mnemonic={Solmnemonic}
              clearMnemonic={handleClearMnemonic}
            />
          </div>
        ) : (
          <div className="w-[90.3%] flex justify-center flex-col">
            <Ethereum
              mnemonic={ETHmnemonic}
              clearMnemonic={handleClearMnemonic}
            />
          </div>
        )}
      </div>
    </>
  );
}
