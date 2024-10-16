import { useState, useEffect } from "react";
import { mnemonicToSeed } from "bip39";
import { validateMnemonic } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import { Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WalletComponent from "./WalletComponent";



export const EthWallet = ({ mnemonic, clearMnemonic }) => {
  const [ETHCurrentIndex, setETHCurrentIndex] = useState(() => {
    const storedETHCurrentIndex = localStorage.getItem("ETHCurrentIndex");
    return storedETHCurrentIndex ? JSON.parse(storedETHCurrentIndex) : 0;
  });
  const [ETHPublicKeys, setETHPublicKeys] = useState(() => {
    const storedPublicKeys = localStorage.getItem("ETHPublicKeys");
    return storedPublicKeys ? JSON.parse(storedPublicKeys) : [];
  });
  const [ETHPrivateKeys, setETHPrivateKeys] = useState(() => {
    const storedPrivateKeys = localStorage.getItem("ETHPrivateKeys");
    return storedPrivateKeys ? JSON.parse(storedPrivateKeys) : [];
  });
  const [ETHVisibility, setETHVisibility] = useState(() => {
    const storedVisibility = localStorage.getItem("ETHVisibility");
    return storedVisibility ? JSON.parse(storedVisibility) : [];
  });

  const CopyToClipBoard = async (passedVar) => {
    if (mnemonic) {
      await navigator.clipboard.writeText(passedVar);
      toast.success("Copied to clipboard!", { containerId: "ETHToast" });
    }
  };

  useEffect(() => {
    localStorage.setItem("ETHPublicKeys", JSON.stringify(ETHPublicKeys));
    localStorage.setItem("ETHPrivateKeys", JSON.stringify(ETHPrivateKeys));
    localStorage.setItem("ETHVisibility", JSON.stringify(ETHVisibility));
    localStorage.setItem("ETHCurrentIndex", JSON.stringify(ETHCurrentIndex));
  }, [ETHPublicKeys, ETHPrivateKeys, ETHVisibility, ETHCurrentIndex]);

  const handleETHClearStorage = () => {
    if(mnemonic){setETHPublicKeys([]);
    setETHPrivateKeys([]);
    setETHVisibility([]);
    setETHCurrentIndex(0);

    // Clear localStorage
    localStorage.removeItem("ETHPublicKeys");
    localStorage.removeItem("ETHPrivateKeys");
    localStorage.removeItem("ETHVisibility");
    localStorage.removeItem("ETHCurrentIndex");

    // Clear the mnemonic as well
    clearMnemonic();

    setTimeout(() => {
      toast.success("Data cleared successfully!", { containerId: "ETHToast" });
    }, 0);}
  };

  const handleETHToggle = (index) => {
    setETHVisibility((prev) =>
      prev.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  const handleETHAddWallet = async () => {
    try {
      console.log(ETHCurrentIndex);
      if (!mnemonic || !validateMnemonic(mnemonic)) {
        toast.error("Invalid mnemonic provided", { containerId: "ETHToast" });
      } else {
        const seed = await mnemonicToSeed(mnemonic);
        const derivationPath = `m/44'/60'/${ETHCurrentIndex}'/0'`;
        const hdNode = HDNodeWallet.fromSeed(seed);
        const child = hdNode.derivePath(derivationPath);
        const privateKey = child.privateKey;
        const wallet = new Wallet(privateKey);

        if (!wallet) {
          toast.error("Error Adding Wallet", { containerId: "ETHToast" });
        } else {
          toast.success("Wallet Generated Successfully", {
            containerId: "ETHToast",
          });
        }

        setETHCurrentIndex((prevIndex) => prevIndex + 1);
        setETHPublicKeys((prevKeys) => [...prevKeys, wallet.address]);
        setETHPrivateKeys((prevKeys) => [...prevKeys, privateKey]);
        setETHVisibility((prev) => [...prev, false]);
      }
    } catch (error) {
      console.error("Error adding wallet:", error);
    }
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
        containerId={`ETHToast`}
      />

     <WalletComponent
      network="Ethereum"
      handleAddWallet={handleETHAddWallet}
      handleClearStorage={handleETHClearStorage}
      publicKeys={ETHPublicKeys}
      privateKeys={ETHPrivateKeys}
      visibility={ETHVisibility}
      toggleVisibility={handleETHToggle}
      copyToClipboard={CopyToClipBoard}
     
     />
    </>
  );
};

export default EthWallet;
