import React from 'react'
import { useState } from 'react';
import { generateMnemonic } from 'bip39';

function Mnemonics() {

    const [mnemonic, setMnemonic] = useState([]);

  return (
   <>
   <button onClick={async function () {
    const mn =await generateMnemonic();
    setMnemonic(mn)
   }}>Seed</button>

   <input type="text" value={mnemonic} />
   </>
  )
}

export default Mnemonics
