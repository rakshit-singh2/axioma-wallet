import React from 'react';
import { Button } from 'antd';
// Translate 
import { useTranslation } from 'react-i18next';
// Translate

const AddAccountView = ({ addChildAccount, handleImportAccountClick }) => {
	// Translate
	const { t, i18n } = useTranslation();
	const handleLanguageChange = (event) => {
	i18n.changeLanguage(event.target.value);
	};
	// Translate
  return (
    <>
      <Button style={{ width: "100%", marginTop: "20px" }} type="primary" onClick={addChildAccount}>
         {t('Add account')}
      </Button><br />
      <Button style={{ width: "100%", marginTop: "20px" }} type="primary" onClick={handleImportAccountClick}>
         {t('Import Account')}
      </Button>
    </>
  );
};

export default AddAccountView;
