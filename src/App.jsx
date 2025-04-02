import "./App.css";
import { useState, useEffect } from "react";

import { Routes, Route, useNavigate } from "react-router-dom";
import Home from './components/Home';
import CreateWallet from "./components/CreateWallet";
import RecoverWallet from "./components/RecoverWallet";
import WalletView from "./components/WalletView/WalletView";
import SetPassword from "./components/SetPassword";
import EnterPassword from "./components/EnterPassword";
import { getPass, getLocalStorage, getAllAccounts  } from './helpers/storage';
import ResetPassword from "./components/ResetPassword";
import './i18n'; // Import the i18n configuration
import { useTranslation } from 'react-i18next';


function App() {
	
	const { t, i18n } = useTranslation();

	// Handle language change
	const handleLanguageChange = (event) => {
	const selectedLanguage = event.target.value;
	i18n.changeLanguage(selectedLanguage); // Change the language in i18next
	localStorage.setItem('language', selectedLanguage); // Save the selected language to localStorage
	};
  
  
  const [walletAddress, setWalletAddress] = useState(null);
  const [seedPhrase, setSeedPhrase] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const storedSeedPhrase = getLocalStorage("SeedPhrase");
        const allAccounts = await getAllAccounts();
        const pass = await getPass();

        if (storedSeedPhrase) {
          setSeedPhrase(storedSeedPhrase);
        }

        if (allAccounts != null && allAccounts.length > 0) {
          setWalletAddress(allAccounts[0].address);
        }

        if (allAccounts != null && allAccounts.length > 0) {
          setPassword(pass);
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    };

    fetchWalletData();
    
  }, []);

  return (
    <div className="App">
	 
      <div className="headers">
        <img src="/WalletLogo.png" className="frontPageLogo" alt="logo" style={{ width: 'auto', height: '80px' }} />
		
		<div className="language-selector">
        <label>{t('Language')}:</label>
        <select onChange={handleLanguageChange} defaultValue={i18n.language}>
          <option value="en">English</option>
          <option value="cn">Chinese </option>
        </select>
      </div>
      </div>
      <Routes>
        {walletAddress && seedPhrase ? (password ? (
          <>
            <Route path="/" element={<EnterPassword />} />
            <Route
              path="/wallet"
              element={<WalletView
                walletAddress={walletAddress}
                setWalletAddress={setWalletAddress}
                seedPhrase={seedPhrase}
                setSeedPhrase={setSeedPhrase}
              />}
            />
            <Route path="/setPassword" element={<SetPassword />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
          </>
        ) : (
          <>
            <Route path="/" element={<SetPassword />} />
            <Route
              path="/wallet"
              element={<WalletView
                walletAddress={walletAddress}
                setWalletAddress={setWalletAddress}
                seedPhrase={seedPhrase}
                setSeedPhrase={setSeedPhrase}
              />}
            />
          </>

        )) : (
          <>
            <Route path="/" element={<Home />} />
            <Route
              path="/recover"
              element={<RecoverWallet
                setSeedPhrase={setSeedPhrase}
                setWalletAddress={setWalletAddress}
              />}
            />
            <Route
              path="/yourwallet"
              element={<CreateWallet
                setSeedPhrase={setSeedPhrase}
                setWalletAddress={setWalletAddress}
              />}
            />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
