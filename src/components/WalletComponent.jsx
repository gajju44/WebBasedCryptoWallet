import { useState } from "react";
import { ToastContainer, Slide } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css';

import ShowIcon from "../assets/show.svg";
import HideIcon from "../assets/hide.svg";
import Delete from "../assets/delete.gif"

const WalletComponent = ({
  network,
  handleAddWallet,
  handleClearStorage,
  publicKeys,
  privateKeys,
  visibility,
  toggleVisibility,
  copyToClipboard,
 

}) => {
  // const [MnemonicCheck, setMnemonicCheck] = useState();
  
 

  const [isLoading, setIsLoading] = useState(false);
  

  const handleClick = async () => {

    const mnemonicExists =
      network === "Ethereum"
        ? localStorage.getItem("ETHmnemonic")
        : network === "Solana"
        ? localStorage.getItem("Solmnemonic")
        : localStorage.getItem("Bitmnemonic");

    if(mnemonicExists)
   { setIsLoading(true);

    
     await setTimeout(() => {
      setIsLoading(false);
      handleClearStorage(); 
    }, 3000); 
    }
   

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
        containerId={`${network}Toast`}
      />

      <div className="flex flex-col gap-5 w-full h-auto p-4  border-[0.5px]  mb-6  rounded-md">
        <span className="select-none flex flex-col sm:flex-row justify-between p-3 items-center whitespace-nowrap">
          <span className="text-2xl font-bold">{network} Wallet</span>
          <div className="flex flex-col sm:flex-row gap-2">
            <button onClick={handleAddWallet}>Add {network} Wallet</button>
            <button
              onClick={handleClick}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
           {isLoading ? (
        <img
          src={Delete}
          alt="Loading..."
          className="w-10 h-10" 
        />
      ) : (
        "Clear All"
      )}
            </button>
          </div>
        </span>

        {publicKeys.map((publicKey, index) => (
          <div
            key={index}
            className="select-none flex flex-col gap-3  border-[0.5px]  mb-3 p-4 rounded-md"
          >
            <span className="text-left text-2xl font-bold pl-5 my-4">
              Wallet {index + 1}
            </span>
            <button
              className="text-left gap-2 flex flex-col hover:text-[#959595]"
              onClick={() => copyToClipboard(publicKey)}
            >
              <span className="text-xl font-bold">Public Key</span>
              <p className="w-[96%] truncate">{publicKey}</p>
            </button>
            <button
              className="text-left gap-2 flex flex-col cursor-default hover:text-[#959595]"
             
            >
              <span className="text-xl font-bold w-full flex justify-between items-center whitespace-nowrap">
                <span>Private Key</span>
                <button
                  className="rounded-full bg-inherit w-7 h-7 flex justify-center items-center p-0 hover:bg-[#99999948] hover:border-none"
                  onClick={() => toggleVisibility(index)}
                >
                  {visibility[index] ? (
                    <img src={ShowIcon} alt="Show icon" className="w-[15px] h-[15px]" />
                  ) : (
                    <img src={HideIcon} alt="Hide icon" className="w-[15px] h-[15px]" />
                  )}
                </button>
              </span>
              <p className="w-[96%] truncate cursor-pointer hover:text-[#959595] select-none"  onClick={() => copyToClipboard(privateKeys[index])}>
                {visibility[index]
                  ? privateKeys[index]
                  : "* * * * * * * * * * * * * * * * * * * * * * * * *"}
              </p>
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default WalletComponent;
