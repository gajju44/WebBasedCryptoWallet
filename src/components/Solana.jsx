import { useState } from "react";
import { mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";



function Solana({mnemonic}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);
  const [privateKeys, setPrivateKeys] = useState([]);

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
        const privateKeyHex = Buffer.from(secret).toString('hex');
        setPrivateKeys((prevKeys) => [...prevKeys, privateKeyHex]);
    } catch (error) {
        console.error("Error adding wallet:", error);
    }
  };

  return (
   <>
     <div className="flex flex-col gap-5  w-[77.3%] h-auto p-4 bg-[#111111] border-[0.5px] border-[#2b2b2b] mb-6 overflow-x-hidden rounded-md">

     <span className='flex justify-between p-3 items-center whitespace-nowrap'>  
     <span className='text-2xl font-bold'>Solana Wallet </span> 
            <button onClick={handleAddWallet}>Add wallet</button>
</span>


{publicKeys.map((publicKey, index) => (
          <div key={index} className=" flex flex-col gap-3 bg-[#111111] border-[0.5px] border-[#2b2b2b] mb-3 p-4 rounded-md">
            <span className="text-left text-2xl font-bold pl-5">Wallet {index+1} </span>
            <button className="text-left gap-2 flex flex-col"> <span className="text-xl font-bold">Public Key</span> {publicKey}</button>
            <button className="text-left gap-2 flex flex-col"> <span className="text-xl font-bold w-full flex justify-between items-center whitespace-nowrap"><span>Private Key </span> <button className="bg-inherit w-fit h-fit p-0"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={24} height={24} strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
</svg>
</button> </span> {privateKeys[index]}</button>
          </div>
        ))}
            

      </div>
   </>
  )
}

export default Solana;
