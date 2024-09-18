import React, { useState } from 'react';
import { ethers } from 'ethers'; 
import Show from "../assets/show.svg";
import Hide from "../assets/hide.svg";
import { mnemonicToSeed } from 'bip39';

function Ethereum({ mnemonic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [privateKeys, setPrivateKeys] = useState([]);
  const [visibility, setVisibility] = useState([]);

  const handleAddWallet = async () => {
    try {
      
      const seed = await mnemonicToSeed(mnemonic);
      
      const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
    
      const hdNode = ethers.utils.HDNode.fromSeed(seed);
     
      const child = hdNode.derivePath(derivationPath);
      
      const privateKey = child.privateKey;
      const wallet = new ethers.Wallet(privateKey);
      
    
      setCurrentIndex(prevIndex => prevIndex + 1);
      setAddresses(prevAddresses => [...prevAddresses, wallet.address]);
      setPrivateKeys(prevPrivateKeys => [...prevPrivateKeys, wallet.privateKey]);
      setVisibility(prevVisibility => [...prevVisibility, false]); 
    } catch (error) {
      console.error("Error adding wallet:", error);
    }
  };

  const handleToggle = (index) => {
    setVisibility(prevVisibility =>
      prevVisibility.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  return (
    <div className="flex flex-col gap-5 w-[77.3%] h-auto p-4 bg-[#111111] border-[0.5px] border-[#2b2b2b] mb-6 overflow-x-hidden rounded-md">
      <span className='flex justify-between p-3 items-center whitespace-nowrap'>
        <span className='text-2xl font-bold'>Ethereum Wallets</span>
        <button onClick={handleAddWallet}>Add ETH Wallet</button>
      </span>

      {addresses.map((address, index) => (
        <div key={index} className="flex flex-col gap-3 bg-[#111111] border-[0.5px] border-[#2b2b2b] mb-3 p-4 rounded-md">
          <span className="text-left text-2xl font-bold pl-5">Wallet {index + 1}</span>
          <button className="text-left gap-2 flex flex-col break-words">
            <span className="text-xl font-bold">Address</span>
            {address}
          </button>
          <button className="text-left gap-2 flex flex-col">
            <span className="text-xl font-bold w-full flex justify-between items-center whitespace-nowrap">
              <span>Private Key</span>
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
              {visibility[index]
                ? privateKeys[index]
                : '* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *'}
            </span>
          </button>
        </div>
      ))}
    </div>
  );
}

export default Ethereum;
