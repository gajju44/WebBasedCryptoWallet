import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { generateMnemonic } from 'bip39';
import Solana from './Solana';
import Ethereum from './Ethereum';




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
        <div className='h-screen overflow-x-hidden w-screen absolute top-0 left-0 mb-6 flex flex-col items-center gap-5 py-11'>
            
        
           <div className='flex flex-col relative left-0 w-[77.3%] h-auto p-4 bg-[#111111] border-[0.5px] border-[#2b2b2b] rounded-md '>
            
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

{DerivationPath === 'm/44/501/0' ?
           <div className='w-[77.3%] flex justify-center flex-col'>

                        <Solana mnemonic={mnemonic}/>

             
                        </div>
:
            <div className='w-[77.3%] flex justify-center flex-col'>

                        <Ethereum mnemonic={mnemonic}/>

                        </div>
                        }
            </div>
        </>
    );
}
