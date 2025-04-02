import React from 'react';
import { Button } from 'antd';
import QRCodeGenerator from '../QRCodeGenerator/QRCodeGenerator';
// Translate 
import { useTranslation } from 'react-i18next';
// Translate

const AccountDetailsView = ({ walletAddress, privateKey, showPrivateKey, handleShowPrivateKey }) => {
	// Translate
	const { t, i18n } = useTranslation();
	const handleLanguageChange = (event) => {
	i18n.changeLanguage(event.target.value);
	};
	// Translate
  return (
    <div>
      <QRCodeGenerator walletAddress={walletAddress} />
      <p>{t('Account address')}: {walletAddress}</p>
      {showPrivateKey && <p>{t('Private Key')}: {privateKey}</p>}
      <Button onClick={handleShowPrivateKey}>
        {showPrivateKey ? "{t('Hide Private Key')}" : "{t('Show Private Key')}"}
      </Button>
    </div>
  );
};

export default AccountDetailsView;
