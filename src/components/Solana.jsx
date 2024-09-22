import { useState, useEffect } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { validateMnemonic } from "bip39";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from 'bs58'; 

import { ToastContainer, toast } from 'react-toastify';
import { Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Show from "../assets/show.svg";
import Hide from "../assets/hide.svg";

function Solana({ mnemonic , clearMnemonic }) {
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

  const CopyToClipBoard = async (passedVar) => {
    if (mnemonic) {
      await navigator.clipboard.writeText(passedVar);
      toast.success('Copied to clipboard!', { containerId: 'solanaToast' });
    }
  };

  const handleToggle = (index) => {
    setVisibility((prev) =>
      prev.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  const handleAddWallet = async () => {
    try {
      if (!mnemonic || !validateMnemonic(mnemonic)) {
        toast.error("Invalid mnemonic provided", { containerId: 'solanaToast' });
      } else {

        console.log(currentIndex);

        const seed = await mnemonicToSeed(mnemonic);
        const path = `m/44'/501'/${currentIndex}'/0'`;
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const keypair = Keypair.fromSecretKey(secret);

        const newPublicKey = keypair.publicKey.toBase58();
        const newPrivateKey = bs58.encode(secret);

        setCurrentIndex((prevIndex) => prevIndex + 1);
        setPublicKeys((prevKeys) => [...prevKeys, newPublicKey]);
        setPrivateKeys((prevKeys) => [...prevKeys, newPrivateKey]);
        setVisibility((prev) => [...prev, false]);

        toast.success('Wallet Generated Successfully', { containerId: 'solanaToast' });
      }
    } catch (error) {
      console.error("Error adding wallet:", error);
    }
  };

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
      toast.success('Data cleared successfully!', { containerId: 'solanaToast' });
    }, 0);
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
        containerId="solanaToast"
      />

      <div className="flex flex-col gap-5 w-full h-auto p-4 bg-[#111111] border-[0.5px] border-[#2b2b2b] mb-6 overflow-x-hidden rounded-md">
        <span className='select-none flex justify-between p-3 items-center whitespace-nowrap'>
          <span className='text-2xl font-bold'>Solana Wallet </span>
          <div className="flex gap-2">
            <button onClick={handleAddWallet}>Add wallet</button>
            <button onClick={handleClearStorage} className="bg-red-500 text-white px-3 py-1 rounded">Clear All</button>
          </div>
        </span>

        {publicKeys.map((publicKey, index) => (
          <div key={index} className="select-none flex flex-col gap-3 bg-[#111111] border-[0.5px] border-[#2b2b2b] mb-3 p-4 rounded-md">
            <span className="text-left text-2xl font-bold pl-5 my-4">Wallet {index + 1} </span>
            <button className="text-left gap-2 flex flex-col break-words hover:text-white" onClick={() => CopyToClipBoard(publicKey)}> 
              <span className="text-xl font-bold">Public Key</span> {publicKey}
            </button>
            <button className="text-left gap-2 flex flex-col hover:text-white" onClick={() => CopyToClipBoard(privateKeys[index])}>
              <span className="text-xl font-bold w-full flex justify-between items-center whitespace-nowrap">
                <span>Private Key </span>
                <button
                  className="rounded-full bg-inherit w-7 h-7 flex justify-center items-center p-0 hover:bg-[#99999948] hover:border-none"
                  onClick={() => handleToggle(index)}
                >
                  {visibility[index] ? (
                    <img src={Show} alt="Show icon" className="w-[15px] h-[15px]" />
                  ) : (
                    <img src={Hide} alt="Hide icon" className="w-[15px] h-[15px]" />
                  )}
                </button>
              </span>
              <span className="w-[96%] break-words">
                {visibility[index] ? privateKeys[index] : '* * * * * * * * * * * * * * * * * * * * * * * * *'}
              </span>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Solana;
