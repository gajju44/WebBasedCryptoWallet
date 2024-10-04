import { useState, useEffect } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { validateMnemonic } from "bip39";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { ToastContainer, toast } from "react-toastify";
import { Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WalletComponent from "./WalletComponent";

function Solana({ mnemonic, clearMnemonic }) {
  const [SolCurrentIndex, setSolCurrentIndex] = useState(() => {
    const storedSolCurrentIndex = localStorage.getItem("SolCurrentIndex");
    return storedSolCurrentIndex ? JSON.parse(storedSolCurrentIndex) : 0;
  });
  const [SolPublicKeys, setSolPublicKeys] = useState(() => {
    const storedPublicKeys = localStorage.getItem("SolPublicKeys");
    return storedPublicKeys ? JSON.parse(storedPublicKeys) : [];
  });
  const [SolPrivateKeys, setSolPrivateKeys] = useState(() => {
    const storedPrivateKeys = localStorage.getItem("SolPrivateKeys");
    return storedPrivateKeys ? JSON.parse(storedPrivateKeys) : [];
  });
  const [SolVisibility, setSolVisibility] = useState(() => {
    const storedVisibility = localStorage.getItem("SolVisibility");
    return storedVisibility ? JSON.parse(storedVisibility) : [];
  });

  const CopyToClipBoard = async (passedVar) => {
    if (mnemonic) {
      await navigator.clipboard.writeText(passedVar);
      toast.success("Copied to clipboard!", { containerId: "solanaToast" });
    }
  };

  const handleSolAddWallet = async () => {
    try {
      if (!mnemonic || !validateMnemonic(mnemonic)) {
        toast.error("Invalid mnemonic provided", {
          containerId: "solanaToast",
        });
      } else {
        console.log(SolCurrentIndex);

        const seed = await mnemonicToSeed(mnemonic);
        const path = `m/44'/501'/${SolCurrentIndex}'/0'`;
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const keypair = Keypair.fromSecretKey(secret);

        const newPublicKey = keypair.publicKey.toBase58();
        const newPrivateKey = bs58.encode(secret);

        setSolCurrentIndex((prevIndex) => prevIndex + 1);
        setSolPublicKeys((prevKeys) => [...prevKeys, newPublicKey]);
        setSolPrivateKeys((prevKeys) => [...prevKeys, newPrivateKey]);
        setSolVisibility((prev) => [...prev, false]);

        toast.success("Wallet Generated Successfully", {
          containerId: "solanaToast",
        });
      }
    } catch (error) {
      console.error("Error adding wallet:", error);
    }
  };

  const handleSolToggle = (index) => {
    setSolVisibility((prev) =>
      prev.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  useEffect(() => {
    localStorage.setItem("SolPublicKeys", JSON.stringify(SolPublicKeys));
    localStorage.setItem("SolPrivateKeys", JSON.stringify(SolPrivateKeys));
    localStorage.setItem("SolVisibility", JSON.stringify(SolVisibility));
    localStorage.setItem("SolCurrentIndex", JSON.stringify(SolCurrentIndex));
  }, [SolPublicKeys, SolPrivateKeys, SolVisibility, SolCurrentIndex]);

  const handleSolClearStorage = () => {
    setSolPublicKeys([]);
    setSolPrivateKeys([]);
    setSolVisibility([]);
    setSolCurrentIndex(0);

    // Clear localStorage
    localStorage.removeItem("SolPublicKeys");
    localStorage.removeItem("SolPrivateKeys");
    localStorage.removeItem("SolVisibility");
    localStorage.removeItem("SolCurrentIndex");

    // Clear the mnemonic as well
    clearMnemonic();

    setTimeout(() => {
      toast.success("Data cleared successfully!", {
        containerId: "solanaToast",
      });
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
        containerId={`solanaToast`}
      />

     <WalletComponent
      network="Solana"
      handleAddWallet={handleSolAddWallet}
      handleClearStorage={handleSolClearStorage}
      publicKeys={SolPublicKeys}
      privateKeys={SolPrivateKeys}
      visibility={SolVisibility}
      toggleVisibility={handleSolToggle}
      copyToClipboard={CopyToClipBoard}
    
     
    />
    </>
  );
}

export default Solana;
