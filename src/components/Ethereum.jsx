import { useState, useEffect } from "react";
import { mnemonicToSeed } from "bip39";
import { validateMnemonic } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import { Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WalletComponent from "./WalletComponent";
import CryptoJS from "crypto-js";

const secretKey = "********";

export const EthWallet = ({ mnemonic, clearMnemonic }) => {
  const encryptData = (data) => CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();

  const decryptData = (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
      console.error("Error decrypting data", e);
      return null;
    }
  };

  const [ETHCurrentIndex, setETHCurrentIndex] = useState(() => {
    const storedETHCurrentIndex = localStorage.getItem("ETHCurrentIndex");
    return storedETHCurrentIndex ? decryptData(storedETHCurrentIndex) : 0;
  });

  const [ETHPublicKeys, setETHPublicKeys] = useState(() => {
    const storedPublicKeys = localStorage.getItem("ETHPublicKeys");
    return storedPublicKeys ? decryptData(storedPublicKeys) : [];
  });

  const [ETHPrivateKeys, setETHPrivateKeys] = useState(() => {
    const storedPrivateKeys = localStorage.getItem("ETHPrivateKeys");
    return storedPrivateKeys ? decryptData(storedPrivateKeys) : [];
  });

  const [ETHVisibility, setETHVisibility] = useState(() => {
    const storedVisibility = localStorage.getItem("ETHVisibility");
    return storedVisibility ? decryptData(storedVisibility) : [];
  });

  const CopyToClipBoard = async (passedVar) => {
    if (mnemonic) {
      await navigator.clipboard.writeText(passedVar);
      toast.success("Copied to clipboard!", { containerId: "ETHToast" });
    }
  };

  useEffect(() => {
    localStorage.setItem("ETHPublicKeys", encryptData(ETHPublicKeys));
    localStorage.setItem("ETHPrivateKeys", encryptData(ETHPrivateKeys));
    localStorage.setItem("ETHVisibility", encryptData(ETHVisibility));
    localStorage.setItem("ETHCurrentIndex", encryptData(ETHCurrentIndex));
  }, [ETHPublicKeys, ETHPrivateKeys, ETHVisibility, ETHCurrentIndex]);

  const handleETHClearStorage = () => {
    if (mnemonic) {
      setETHPublicKeys([]);
      setETHPrivateKeys([]);
      setETHVisibility([]);
      setETHCurrentIndex(0);

      
      localStorage.removeItem("ETHPublicKeys");
      localStorage.removeItem("ETHPrivateKeys");
      localStorage.removeItem("ETHVisibility");
      localStorage.removeItem("ETHCurrentIndex");

     
      clearMnemonic();

      setTimeout(() => {
        toast.success("Data cleared successfully!", { containerId: "ETHToast" });
      }, 0);
    }
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
