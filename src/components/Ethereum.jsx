import { useState, useEffect } from "react";
import { mnemonicToSeed } from "bip39";
import { validateMnemonic } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import { ToastContainer, toast } from 'react-toastify';
import { Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Show from "../assets/show.svg";
import Hide from "../assets/hide.svg";

export const EthWallet = ({ mnemonic , clearMnemonic}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState(() => {
    const storedPublicKeys = localStorage.getItem('publicKeys');
    return storedPublicKeys ? JSON.parse(storedPublicKeys) : [];
  });
  const [privateKeys, setPrivateKeys] = useState(() => {
    const storedPrivateKeys = localStorage.getItem('privateKeys');
    return storedPrivateKeys ? JSON.parse(storedPrivateKeys) : [];
  });
  const [visibility, setVisibility] = useState(() => {
    const storedVisibility = localStorage.getItem('visibility');
    return storedVisibility ? JSON.parse(storedVisibility) : [];
  });


  useEffect(() => {
    localStorage.setItem('publicKeys', JSON.stringify(publicKeys));
    localStorage.setItem('privateKeys', JSON.stringify(privateKeys));
    localStorage.setItem('visibility', JSON.stringify(visibility));
  }, [publicKeys, privateKeys, visibility]);


  const handleClearStorage = () => {
    setPublicKeys([]);
    setPrivateKeys([]);
    setVisibility([]);
    setCurrentIndex(0);

    // Clear localStorage
    localStorage.removeItem('publicKeys');
    localStorage.removeItem('privateKeys');
    localStorage.removeItem('visibility');

    // Clear the mnemonic as well
    clearMnemonic();

    setTimeout(() => {
      toast.success('Data cleared successfully!', { containerId: 'ETHToast' });
    }, 0);
};




  const CopyToClipBoard = async(passedVar) => {
    if(mnemonic){
    await navigator.clipboard.writeText(passedVar);
    toast.success('Copied to clipboard!', { containerId: 'ETHToast' });

}
   }

  
  const handleToggleVisibility = (index) => {
    setVisibility((prev) =>
      prev.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  const handleAddWallet = async () => {
    try {
      if (!mnemonic || !validateMnemonic(mnemonic)) {
        toast.error("Invalid mnemonic provided", { containerId: 'ETHToast' });
      }
    else{ const seed = await mnemonicToSeed(mnemonic);
      const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
      const hdNode = HDNodeWallet.fromSeed(seed);
      const child = hdNode.derivePath(derivationPath);
      const privateKey = child.privateKey;
      const wallet = new Wallet(privateKey);

      if(!wallet){
        toast.error("Error Adding Wallet", { containerId: 'ETHToast' }) 
      }
      else{
      toast.success('Wallet Generated Successfully', { containerId: 'ETHToast' });}

      setCurrentIndex((prevIndex) => prevIndex + 1);
      setPublicKeys((prevKeys) => [...prevKeys, wallet.address]);
      setPrivateKeys((prevKeys) => [...prevKeys, privateKey]);
      setVisibility((prev) => [...prev, false]);}
     
    } catch (error) {
      console.error("Error adding wallet:", error);
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
        containerId="ETHToast"
      />
    <div className=" flex flex-col gap-5 w-full h-auto p-4 bg-[#111111] border-[0.5px] border-[#2b2b2b] mb-6 overflow-x-hidden rounded-md">
      <span className="flex justify-between p-3 items-center whitespace-nowrap">
        <span className="text-2xl font-bold select-none">Ethereum Wallets</span>
        <div className="flex gap-2">
        <button onClick={handleAddWallet} className="select-none">Add ETH Wallet</button>
        <button onClick={handleClearStorage} className="bg-red-500 text-white px-3 py-1 rounded">Clear All Wallet</button>
        </div>
      </span>

      {publicKeys.map((publicKey, index) => (
        <div key={index} className="flex flex-col gap-3 bg-[#111111] border-[0.5px] border-[#2b2b2b] mb-3 p-4 rounded-md">
          <span className="text-left text-2xl font-bold pl-5 my-4 select-none">Wallet {index + 1}</span>

          <button className="text-left gap-2 flex select-none flex-col break-words hover:text-white" onClick={() => CopyToClipBoard(publicKey)}>
            <span className="text-xl font-bold ">Public Key</span> {publicKey}
          </button>

          <button className="text-left gap-2 flex flex-col cursor-default" >
            <span className="text-xl font-bold w-full flex justify-between items-center whitespace-nowrap">
              <span className="select-none">Private Key</span>
              <button
                className="select-none rounded-full bg-inherit w-7 h-7 flex justify-center items-center p-0 hover:bg-[#99999948] hover:border-none"
                onClick={() => handleToggleVisibility(index)}>
                {visibility[index] ? (
                  <img src={Show} alt="Show icon" className="w-[15px] h-[15px]" />
                ) : (
                  <img src={Hide} alt="Hide icon" className="w-[15px] h-[15px]" />
                )}
              </button>
            </span>
            <span className="select-none w-full break-words cursor-pointer hover:text-white" onClick={() => CopyToClipBoard(privateKeys[index])}>
              {visibility[index] ? privateKeys[index] : '* * * * * * * * * * * * * * * * * * * * * * * * *'}
            </span>
          </button>
        </div>
      ))}
    </div>
    </>
  );
};

export default EthWallet;
