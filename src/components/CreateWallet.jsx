import React, { useState } from "react";
import { Button, Card, Spin } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Wallet, HDNodeWallet, Mnemonic } from "ethers";
import { setLocalStorage, createAccountEntry, countAccounts, setChildCount } from "../helpers/storage";
import { encryptData, decryptData } from "../helpers/encryption";
import { initializeChainsDb } from "../helpers/chains";
// Translate 
import { useTranslation } from 'react-i18next';
// Translate
function CreateAccount({ setWalletAddress, setSeedPhrase }) {
	
  // Translate
	const { t, i18n } = useTranslation();
	const handleLanguageChange = (event) => {
	i18n.changeLanguage(event.target.value);
	};
	// Translate
  const [newSeedPhrase, setNewSeedPhrase] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function generateWallet() {
    if (!newSeedPhrase) {
      const mnemonic = Wallet.createRandom().mnemonic.phrase;
      const encryptedMnemonic = encryptData(mnemonic);
      setNewSeedPhrase(mnemonic);
      setLocalStorage("SeedPhrase", encryptedMnemonic);
    }
  }

  const setWalletAndMnemonic = async () => {
    try {
      const encryptedMnemonic = localStorage.getItem("SeedPhrase");
      const decryptedMnemonic = decryptData(encryptedMnemonic);
      setSeedPhrase(decryptedMnemonic);
      const mnemonicInstance = Mnemonic.fromPhrase(decryptedMnemonic);
      const count = await countAccounts();
      const firstAccount = HDNodeWallet.fromMnemonic(mnemonicInstance, `m/44'/60'/0'/0/0`);
      createAccountEntry(firstAccount.address, `Account3 ${count + 1}`, encryptData(firstAccount.privateKey));
      setLoading(true)
      await initializeChainsDb().then(() => { setLoading(false) })
      setWalletAddress(firstAccount.address);
      setChildCount(encryptData("1"));
      setWalletAddress(firstAccount.address);
      navigate("/");
    } catch (error) {
      console.error("Error decrypting mnemonic:", error);
    }
  }
  if (loading) {
    return <div><Spin size="large" /></div>;
  }
  return (
    <>
      <div className="content">
        <div className="mnemonic">
          <ExclamationCircleOutlined style={{ fontSize: "20px" }} />
          <div>
            {t('Once you generate the seed phrase, save it securely in order to recover your wallet in the future.')}
          </div>
        </div>
        <Button
          className="frontPageButton"
          type="primary"
          onClick={() => generateWallet()}
        >
         
		  {t('Generate Seed Phrase')}
        </Button>
        <Card className="seedPhraseContainer">
          {newSeedPhrase && <pre style={{ whiteSpace: "pre-wrap" }}>{newSeedPhrase}</pre>}
        </Card>
        <Button
          className="frontPageButton"
          type="default"
          onClick={() => setWalletAndMnemonic()}
        >
          
		  {t('Open Your New Wallet')}
        </Button>
        <p className="frontPageBottom" onClick={() => navigate("/")}>
          
		   {t('Back Home')}
        </p>
      </div>
    </>
  );
}

export default CreateAccount;
