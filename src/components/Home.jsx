import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

// Translate 
import { useTranslation } from 'react-i18next';
// Translate

function Home() {
	
	// Translate
	const { t, i18n } = useTranslation();
	const handleLanguageChange = (event) => {
	i18n.changeLanguage(event.target.value);
	};
	// Translate
	
  const navigate = useNavigate()

  return (
    <>
      <div className="content homepage">

        <h2>{t('AXIOMA Wallet')}</h2>
        <h4>{t('Your assets, your control – Axioma Chain’s decentralized wallet solution')}</h4>
        <Button
          onClick={() => navigate("/yourwallet")}
          className="frontPageButton button1"
          type="primary"
        >
          {t('Create A Wallet')}
        </Button>
        <Button
          onClick={() => navigate("/recover")}
          className="frontPageButton"
          type="default"
        >
		
		  {t('Sign In With Seed Phrase')}
         
        </Button>
        
      </div>
    </>
  );
}

export default Home;
