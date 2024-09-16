import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { generateMnemonic } from 'bip39';
import Solana from './Solana';





export default function MnemonicsGen() {
    const [mnemonic, setMnemonic] = useState([]);
    const [individualMnemonic, setIndividualMnemonic] = useState([]);
    const [isClicked, setIsClicked] = useState(false);

    const location = useLocation();
    const {DerivationPath} = location.state || {};  
  

    const GenerateMnemonic = () => {
        const mnemonicString = generateMnemonic();
        setMnemonic(mnemonicString); 
        setIndividualMnemonic(mnemonicString.split(" ")); 
        console.log(mnemonicString);
        document.getElementById('manemonicsshow').style.display = 'grid';
        setIsClicked(true);

    };
   
    return (
        <>
        <div className='h-screen w-screen mb-6'>
            
        
           <div className='flex flex-col relative left-0 w-[77.3%] h-auto p-4 bg-[#111111] border-[0.5px] border-[#2b2b2b] rounded-md mb-6'>
            
           <span className='flex justify-between p-3 items-center'>  
            <span className='text-2xl font-bold whitespace-nowrap'>Generate Seed </span> 

           <button onClick={GenerateMnemonic} disabled={isClicked} className='w-fit'>Generate</button>
           
           </span>

            <div id='manemonicsshow' className='will-change-auto mt-5 gap-4 grid-cols-4   p-7 m-1 bg-inherit  rounded-xl hidden '>
                { individualMnemonic.map((mnemonic, index) => (
                    <button key={index}  className=' gap-4 items-center justify-center flex pointer-events-none '> {`${mnemonic}`}</button>
                ))}

               
            </div>

             </div>  

             <div>

                        <Solana mnemonic={mnemonic}/>

             </div>


            </div>
        </>
    );
}
