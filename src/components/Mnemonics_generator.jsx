import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { generateMnemonic, validateMnemonic } from 'bip39';
import Solana from './Solana';
import Ethereum from './Ethereum';
import DownArrow from '../assets/down_arrow.svg';
import UpArrow from '../assets/up_arrow.svg';
export default function MnemonicsGen() {
    const [mnemonic, setMnemonic] = useState('');
    const [individualMnemonic, setIndividualMnemonic] = useState([]);
    const [isClicked, setIsClicked] = useState(false);
    const [customMnemonic, setCustomMnemonic] = useState('');
    const [IsDropDown,setIsDropDown] = useState(false);

    const location = useLocation();
    const { DerivationPath } = location.state || {};


    const handleDropDown = () => {
        setIsDropDown(!IsDropDown);
      };
 
    const GenerateMnemonic = () => {
        const mnemonicString = generateMnemonic();
        setMnemonic(mnemonicString);
        setIndividualMnemonic(mnemonicString.split(' '));
        setIsClicked(true);
    };


    const handleCustomMnemonicChange = (e) => {
        setCustomMnemonic(e.target.value);
    };

   
    const handleUseCustomMnemonic = () => {
        if (validateMnemonic(customMnemonic)) {
            setMnemonic(customMnemonic);
            setIndividualMnemonic(customMnemonic.split(' '));
            setIsClicked(true); 
        } else {
            alert('Invalid mnemonic. Please enter a valid 12 or 24-word mnemonic.');
        }
    };

    return (
        <>
            <div className='h-screen overflow-x-hidden w-screen absolute top-0 left-0 mb-6 flex flex-col items-center gap-5 py-11'>
                <div className='flex flex-col relative left-0 w-[77.3%] h-auto p-4 bg-[#111111] border-[0.5px] border-[#2b2b2b] rounded-md '>
                    <span className='flex justify-between p-3 items-center'>
                        <span className='text-2xl font-bold whitespace-nowrap'>You Wallet's Seed</span>
                        <button onClick={GenerateMnemonic}  className= {`w-fit  ${isClicked ? 'hidden' : ''}`}>
                            Generate New
                        </button>
                        <button onClick={handleDropDown}  className= {`w-fit bg-inherit p-2 rounded-full hover:border-none hover:bg-[#99999948] ${isClicked ? '' : 'hidden'}`}>
                        {IsDropDown ? (<img src={UpArrow} alt="hide" className="w-[24px] h-[24px]" />) : (<img src={DownArrow} alt="show" className="w-[24px] h-[24px]" />)}
                        </button>
                    </span>

                    <div id='manemonicsshow' className={`will-change-auto overflow-hidden mt-5 gap-4 grid grid-cols-4  m-1 bg-inherit transition-all duration-700 ease-in-out rounded-xl ${IsDropDown ? "max-h-0 opacity-0" : "max-h-max opacity-100"}`}>
                        {individualMnemonic.map((mnemonic, index) => (
                            <button key={index} className='gap-4 items-center justify-center flex pointer-events-none'>
                                {mnemonic}
                            </button>
                        ))}
                    </div>

                    <div className={`flex flex-col mt-5 ${isClicked ? 'hidden' : ''}`}>
                        <span className='text-xl font-bold'>Or Recover with Existing Mnemonic:</span>
                        <input
                        type='text'
                            className='p-3 mt-2 bg-[#222222] text-white rounded-md'
                            rows={4}
                            placeholder='Enter your 12 or 24-word mnemonic here...'
                            value={customMnemonic}
                            onChange={handleCustomMnemonicChange}
                        />
                        <button
                            onClick={handleUseCustomMnemonic}
                            className='mt-3'>
                            Use Existing Mnemonic
                        </button>
                    </div>
                </div>

          
                {DerivationPath === 'm/44/501/0' ? (
                    <div className='w-[77.3%] flex justify-center flex-col'>
                        <Solana mnemonic={mnemonic} />
                    </div>
                ) : (
                    <div className='w-[77.3%] flex justify-center flex-col'>
                        <Ethereum mnemonic={mnemonic} />
                    </div>
                )}
            </div>
        </>
    );
}
