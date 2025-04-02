import React, { useState } from "react";
import { BulbOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { getLocalStorage } from "../helpers/storage";
import { decryptData } from "../helpers/encryption";
import LogoutButton from "./LogoutButton";
// Translate 
import { useTranslation } from 'react-i18next';
// Translate
const { TextArea } = Input;

function ResetPassword() {
		// Translate
	const { t, i18n } = useTranslation();
	const handleLanguageChange = (event) => {
	i18n.changeLanguage(event.target.value);
	};
	// Translate
	
  const navigate = useNavigate();
  const [typedSeed, setTypedSeed] = useState("");
  const [error, setError] = useState("");


  const handleSeedChange = (e) => {
    setTypedSeed(e.target.value);
    setError("");
  };

  const resetPassword = async () => {
    try {
      const words = typedSeed.trim().split(" ");
      if (words.length !== 12) {
        setError("Seed phrase must include exactly 12 words separated by spaces.");
        return;
      }
      const encryptedMnemonic = getLocalStorage("SeedPhrase");
      const decryptedMnemonic = decryptData(encryptedMnemonic);
      if (decryptedMnemonic == typedSeed) {
        navigate("/setPassword");
      }
      else {
        setError("Seed Password Not Correct");
      }
    } catch (error) {
      setError("An error occurred while recovering your account.");
    }
  };

  return (
    <div className="content">
      <div className="mnemonic">
        <BulbOutlined style={{ fontSize: 20 }} />
        <div>
           {t('Type your seed phrase in the field below to reset your password.')}
        </div>
      </div>
      <TextArea
        value={typedSeed}
        onChange={handleSeedChange}
        rows={4}
        className="seedPhraseContainer"
        placeholder= {t('Type your seed phrase here...')}
        autoSize={{ minRows: 3, maxRows: 5 }}
      />

      <Button
        disabled={typedSeed.split(" ").length !== 12 || typedSeed.slice(-1) === " "}
        className="frontPageButton"
        type="primary"
        onClick={resetPassword}
      >
        {t('Reset Password')}
      </Button>
      <p style={{ color: 'red' }}>
	  {t('If you have forgotten your seed phase, it cannot be recovered. Please Logout to continue.')}
        
      </p>
      <LogoutButton />{t('Please click to logout')}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p className="frontPageBottom" onClick={() => navigate("/")}>
        <span>{t('Login through Password')}</span>
      </p>
    </div>
  );
}

export default ResetPassword;
