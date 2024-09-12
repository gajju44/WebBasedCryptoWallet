import { useState } from "react";
import { mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";



function Solana({mnemonic}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);

  const handleAddWallet = async () => {
    try {
       console.log(mnemonic);
        const seed = await  mnemonicToSeedSync(mnemonic);

     
        const path = `m/44'/501'/${currentIndex}'/0'`;
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const keypair = Keypair.fromSecretKey(secret);

     
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setPublicKeys((prevKeys) => [...prevKeys, keypair.publicKey.toBase58()]);
    } catch (error) {
        console.error("Error adding wallet:", error);
    }
  };

  return (
   <>
     <div className="flex flex-col gap-5  w-[80%] h-auto p-2 bg-[#111111] border-[0.5px] border-[#2b2b2b] mb-6">

     <span className='flex gap-[75%] p-3 items-center'>  
     <span className='text-2xl font-bold'>Solana Wallet </span> 
            <button onClick={handleAddWallet}>Add wallet</button>
</span>


            {publicKeys.map((publicKey, index) => (
                <button key={index} className="text-left">{publicKey}</button>
            ))}

      </div>
   </>
  )
}

export default Solana;
