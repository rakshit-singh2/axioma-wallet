import React, { useEffect, useState } from "react";
import AccountDropdown from "../AccountDropdown/AccountDropdown";
import WalletViewContent from "./WalletViewContent";
import { getAccountName, getLastChain, getChain } from "../../helpers/storage";
import { Web3 } from 'web3';
import CopyButton from "../CopyButton";
import ChainSelector from "../ChainSelector/ChainSelector";
import LockButton from "../LockButton";
import { Spin } from "antd";

const WalletView = ({
  walletAddress,
  setWalletAddress,
}) => {
  const [selectedChain, setSelectedChain] = useState();
  const [chain, setChain] = useState({});
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [accountName, setAccountName] = useState('');


  const prevChain = async () => {
    const lastSelected = await getLastChain();
    const chainToSet = lastSelected ? lastSelected : '0xed5';
    setSelectedChain(chainToSet);
    const chainData = await getChain(chainToSet);
    setChain(chainData);
    setLoading(false);
  };

  useEffect(() => {
    prevChain();
  }, []);

  useEffect(() => {
    const fetchAccountName = async () => {
      try {
        if (!selectedChain) return;
        const chainData = await getChain(selectedChain);
        setChain(chainData);
        const web3 = new Web3(chainData?.rpcUrl);
        const name = await getAccountName(walletAddress);
        setAccountName(name);
        const weiBalance = await web3.eth.getBalance(walletAddress);
        const etherBalance = web3.utils.fromWei(weiBalance, 'ether');
        const roundedBalance = parseFloat(etherBalance).toFixed(3);
        setBalance(roundedBalance);
      } catch (error) {
        console.error('Error fetching account name:', error);
      }
    };

    fetchAccountName();
  }, [walletAddress, selectedChain]);

  

  if (loading) {
    return <div><Spin size="large" /></div>;
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', width: '100%', backgroundColor: '#fff', padding: '10px'}}>
        <ChainSelector
          selectedChain={selectedChain}
          setSelectedChain={setSelectedChain}
        />
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="accountName" style={{ marginRight: 8 }}>{accountName}</div>
          </div>
          <div>
            <AccountDropdown
              walletAddress={walletAddress}
              setWalletAddress={setWalletAddress}
              selectedChain={selectedChain}
            />
            <CopyButton content={walletAddress} />
          </div>
        </div>
        <LockButton />
      </div>
      <div className="balance-container">
        <div className="balance">
          {balance} {chain?.ticker}
        </div>
      </div>
      <WalletViewContent
        walletAddress={walletAddress}
        selectedChain={selectedChain}
      />
    </>
  );
};

export default WalletView;