import React from "react";
import { Tabs } from "antd";
import TokenList from "../Tabs/TokenList";
import NFTList from "../Tabs/NFTList";
import Transfer from "../Tabs/Transfer";
import TransactionHistory from "../Tabs/TransactionHistory";
// Translate 
import { useTranslation } from 'react-i18next';
import Staking from "../Tabs/Staking";
// Translate
const WalletViewContent = ({ walletAddress, selectedChain, setBalance}) => {
	// Translate
	const { t, i18n } = useTranslation();
	const handleLanguageChange = (event) => {
	i18n.changeLanguage(event.target.value);
	};
	// Translate
  const tabItems = [
    {
      key: "1",
      label: t('Transfer'),
      children: (
        <Transfer
          walletAddress={walletAddress}
          selectedChain={selectedChain}
          setBalance={setBalance}
        />
      ),
    },
    {
      key: "2",
      label: t('History'),
      children: <TransactionHistory 
        walletAddress={walletAddress}
        selectedChain={selectedChain}
      />,
    },
    {
      key: "3",
      label: t('NFTs'),
      children: <NFTList walletAddress={walletAddress} selectedChain={selectedChain} />,
    },
    {
      key: "4",
      label: t('Tokens'),
      children: <TokenList walletAddress={walletAddress} selectedChain={selectedChain} />,
    },
    ...(
      selectedChain === "0x61" || selectedChain === "0x38"
        ? [{
            key: "5",
            label: t('Staking'),
            children: <Staking walletAddress={walletAddress} selectedChain={selectedChain} />,
          }]
        : []
    )
  ];
  
  return (
    <div className="content">
      <Tabs defaultActiveKey="1" items={tabItems} className="walletView" />
    </div>
  );
};

export default WalletViewContent;
