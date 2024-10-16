import  { useState, useEffect } from "react";
import { mnemonicToSeed, validateMnemonic } from "bip39";
import HDKey from "hdkey"; 
import * as bitcoin from "bitcoinjs-lib"; 
import ECPairFactory from 'ecpair'; 
import { ToastContainer, toast, Slide } from "react-toastify";
import * as ecc from 'tiny-secp256k1'; 
import WalletComponent from "./WalletComponent";




function Bitcoin({ mnemonic, clearMnemonic }) {
  const ECPair = ECPairFactory(ecc);
  const [BitcoinCurrentIndex, setBitcoinCurrentIndex] = useState(() => {
    const storedIndex = localStorage.getItem("BitcoinCurrentIndex");
    return storedIndex ? parseInt(storedIndex) : 0;
  });

  const [BitcoinPublicKeys, setBitcoinPublicKeys] = useState(() => {
    const storedKeys = localStorage.getItem("BitcoinPublicKeys");
    return storedKeys ? JSON.parse(storedKeys) : [];
  });

  const [BitcoinPrivateKeys, setBitcoinPrivateKeys] = useState(() => {
    const storedKeys = localStorage.getItem("BitcoinPrivateKeys");
    return storedKeys ? JSON.parse(storedKeys) : [];
  });

  const [BitcoinVisibility, setBitcoinVisibility] = useState(() => {
    const storedVisibility = localStorage.getItem("BitcoinVisibility");
    return storedVisibility ? JSON.parse(storedVisibility) : [];
  });

  const CopyToClipboard = async (passedVar) => {
    if (mnemonic) {
      await navigator.clipboard.writeText(passedVar);
      toast.success("Copied to clipboard!", { containerId: "bitcoinToast" });
    }
  };

  const handleBitcoinAddWallet = async () => {
    try {
      if (!mnemonic || !validateMnemonic(mnemonic)) {
        toast.error("Invalid mnemonic provided", { containerId: "bitcoinToast" });
      } else {
        console.log(BitcoinCurrentIndex);

        const seed = await mnemonicToSeed(mnemonic); 

       
        const hdkey = HDKey.fromMasterSeed(seed);

        
        const path = `m/44'/0'/0'/0/${BitcoinCurrentIndex}`;
        const derivedKey = hdkey.derive(path);

        
        const keyPair = ECPair.fromPrivateKey(derivedKey.privateKey);
        const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey }); 

        const newPublicKey = address;
        const newPrivateKey = keyPair.privateKey.toString("hex");

        setBitcoinCurrentIndex((prevIndex) => prevIndex + 1);
        setBitcoinPublicKeys((prevKeys) => [...prevKeys, newPublicKey]);
        setBitcoinPrivateKeys((prevKeys) => [...prevKeys, newPrivateKey]);
        setBitcoinVisibility((prev) => [...prev, false]);

        toast.success("Wallet Generated Successfully", { containerId: "bitcoinToast" });
      }
    } catch (error) {
      console.error("Error adding wallet:", error);
    }
  };

  const handleBitcoinToggle = (index) => {
    setBitcoinVisibility((prev) =>
      prev.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  useEffect(() => {
    localStorage.setItem("BitcoinPublicKeys", JSON.stringify(BitcoinPublicKeys));
    localStorage.setItem("BitcoinPrivateKeys", JSON.stringify(BitcoinPrivateKeys));
    localStorage.setItem("BitcoinVisibility", JSON.stringify(BitcoinVisibility));
    localStorage.setItem("BitcoinCurrentIndex", JSON.stringify(BitcoinCurrentIndex));
  }, [BitcoinPublicKeys, BitcoinPrivateKeys, BitcoinVisibility, BitcoinCurrentIndex]);

  const handleBitcoinClearStorage = () => {
    setBitcoinPublicKeys([]);
    setBitcoinPrivateKeys([]);
    setBitcoinVisibility([]);
    setBitcoinCurrentIndex(0);

    localStorage.removeItem("BitcoinPublicKeys");
    localStorage.removeItem("BitcoinPrivateKeys");
    localStorage.removeItem("BitcoinVisibility");
    localStorage.removeItem("BitcoinCurrentIndex");

    clearMnemonic();
    setTimeout(() => {
      toast.success("Data cleared successfully!", { containerId: "bitcoinToast" });
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
        containerId={`bitcoinToast`}
      />

      <WalletComponent
        network="Bitcoin"
        handleAddWallet={handleBitcoinAddWallet}
        handleClearStorage={handleBitcoinClearStorage}
        publicKeys={BitcoinPublicKeys}
        privateKeys={BitcoinPrivateKeys}
        visibility={BitcoinVisibility}
        toggleVisibility={handleBitcoinToggle}
        copyToClipboard={CopyToClipboard}
      />
    </>
  );
}

export default Bitcoin;
