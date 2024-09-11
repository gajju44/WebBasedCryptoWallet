import React, { useState } from 'react';
import { generateMnemonic } from 'bip39';

export default function MnemonicsGen() {
    const [mnemonic, setMnemonic] = useState([]);

    const GenerateMnemonic = () => {
        const mnemonicString = generateMnemonic();
        setMnemonic(mnemonicString.split(" ")); // Split into words, not characters
        console.log(mnemonicString);
        document.getElementById('manemonicsshow').style.display = 'grid';


    };
   
    return (
        <>
        <div className='h-screen w-full'>
            
        
           <div className='flex flex-col   '>
            
            <button onClick={GenerateMnemonic}>Generate</button>
            <div id='manemonicsshow' className='will-change-auto mt-5 gap-4 grid-cols-4   p-7 border-[0.5px] border-[#2b2b2b] bg-[#222222]  rounded-xl hidden '>
                {mnemonic.map((mne, index) => (
                    <button key={index}  className=' gap-4 items-center justify-center flex '> {`${mne}`}</button>
                ))}
            </div>

             </div>  
            </div>
        </>
    );
}
