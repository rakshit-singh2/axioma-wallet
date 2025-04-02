import React, { useState } from "react";
import { BulbOutlined } from "@ant-design/icons";
import { Button, Input, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { HDNodeWallet, Mnemonic } from "ethers";
import { setLocalStorage, createAccountEntry, countAccounts, setChildCount } from "../helpers/storage";
import { encryptData, decryptData } from "../helpers/encryption";
import { initializeChainsDb } from "../helpers/chains";
// Translate 
import { useTranslation } from 'react-i18next';
// Translate
const { TextArea } = Input;

function RecoverAccount({ setWalletAddress, setSeedPhrase }) {
	
  // Translate
	const { t, i18n } = useTranslation();
	const handleLanguageChange = (event) => {
	i18n.changeLanguage(event.target.value);
	};
	// Translate	
  const navigate = useNavigate();
  const [typedSeed, setTypedSeed] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSeedChange = (e) => {
    setTypedSeed(e.target.value);
    setError("");
  };

  const recoverWallet = async () => {
    try {
      const words = typedSeed.trim().split(" ");
      if (words.length !== 12) {
        setError("Seed phrase must include exactly 12 words separated by spaces.");
        return;
      }
      const encryptedMnemonic = encryptData(typedSeed);
      setLocalStorage("SeedPhrase", encryptedMnemonic);
      const decryptedMnemonic = decryptData(encryptedMnemonic);
      setSeedPhrase(decryptedMnemonic);
      const mnemonicInstance = Mnemonic.fromPhrase(decryptedMnemonic);
      const firstAccount = HDNodeWallet.fromMnemonic(mnemonicInstance, `m/44'/60'/0'/0/0`);
      const count = await countAccounts();
      createAccountEntry(firstAccount.address, `Account ${count + 1}`, encryptData(firstAccount.privateKey));
      setChildCount(encryptData("1"));
      setLoading(true)
      await initializeChainsDb().then(() => { setLoading(false) })
      setWalletAddress(firstAccount.address);
      navigate("/");
    } catch (error) {
      console.error("Error recovering wallet:", error);
      setError("An error occurred while recovering the wallet.");
    }
  };

  if (loading) {
    return <div><Spin size="large" /></div>;
  }
  return (
    <div className="content">
      <div className="mnemonic">
        <BulbOutlined style={{ fontSize: 20 }} />
        <div>
		{t('Type your seed phrase in the field below to recover your wallet (it should include 12 words separated with spaces).')}
        </div>
      </div>
      <TextArea
        value={typedSeed}
        onChange={handleSeedChange}
        rows={4}
        className="seedPhraseContainer"
        placeholder={t('Type your seed phrase here...')}
        autoSize={{ minRows: 3, maxRows: 5 }}
      />

      <Button
        disabled={typedSeed.split(" ").length !== 12 || typedSeed.slice(-1) === " "}
        className="frontPageButton"
        type="primary"
        onClick={recoverWallet}
      >
        {t('Recover Wallet')} 
      </Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p className="frontPageBottom" onClick={() => navigate("/")}>
        <span> {t('Back Home')}</span>
      </p>
    </div>
  );
}

export default RecoverAccount;
