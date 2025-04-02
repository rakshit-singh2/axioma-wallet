import React, { useState, useEffect } from "react";
import { UserOutlined, EllipsisOutlined, ExportOutlined, PushpinOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { Card, Dropdown, message } from "antd";
import { Web3 } from 'web3';
import { getChain } from "../../helpers/storage";

const AccountElements = ({ walletAddress, account, selectedChain, onClick, setAccountDetailsView, setInfoViewAccount }) => {
  const [balance, setBalance] = useState(0);
  const [chain, setChain] = useState(null);

  useEffect(() => {
    const fetchChainData = async () => {
      try {
        const chainData = await getChain(selectedChain);
        setChain(chainData);
        if (chainData) {
          const web3 = new Web3(chainData.rpcUrl);
          const weiBalance = await web3.eth.getBalance(account.address);
          const etherBalance = web3.utils.fromWei(weiBalance, 'ether');
          const roundedBalance = parseFloat(etherBalance).toFixed(3);
          setBalance(roundedBalance);
        }
      } catch (error) {
        message.error('Failed to fetch chain data or balance');
        console.error(error);
      }
    };

    fetchChainData();
  }, [selectedChain, account.address]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (chain) {
        try {
          const web3 = new Web3(chain.rpcUrl);
          const weiBalance = await web3.eth.getBalance(account.address);
          const etherBalance = web3.utils.fromWei(weiBalance, 'ether');
          const roundedBalance = parseFloat(etherBalance).toFixed(3);
          setBalance(roundedBalance);
        } catch (error) {
          message.error('Failed to fetch balance');
          console.error(error);
        }
      }
    };

    fetchBalance();
  }, [chain]);

  const handleMenuClick = (e) => {
    if (e.key === "1") {
      setInfoViewAccount(account.address);
      setAccountDetailsView(true);
    } else if (e.key === "2") {
      window.open(`${chain.blockExplorerUrl}/address/${account.address}`, '_blank');
    } else if (e.key === "3") {
      console.log('c');
    } else if (e.key === "4") {
      console.log('d');
    }
  };

  const items = [
    {
      label: 'Account Details',
      key: '1',
      icon: <UserOutlined />,
    },
    {
      label: 'View on explorer',
      key: '2',
      icon: <ExportOutlined />,
    },
    {
      label: 'Pin on top',
      key: '3',
      icon: <PushpinOutlined />,
      disabled: true,
    },
    {
      label: 'Hide Account',
      key: '4',
      icon: <EyeInvisibleOutlined />,
      disabled: true,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <Card hoverable style={{ background: (walletAddress === account.address) ? "purple" : "white" }} onClick={onClick}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: (walletAddress === account.address) ? "white" : "black" }}>
        <UserOutlined style={{ fontSize: 24 }} />
        <div style={{ marginLeft: 10 }}>
          <b>{account.label}</b><br />
          {`${account.address.slice(0, 6)}...${account.address.slice(-4)}`}
        </div>
        <div style={{ marginLeft: 10 }}>
          {balance} {chain ? chain.ticker : ''}
        </div>
        <div onClick={stopPropagation}>
          <Dropdown menu={menuProps} trigger={['click']}>
            <EllipsisOutlined style={{ fontSize: 18, color: "#1890ff", transform: "rotate(90deg)" }} />
          </Dropdown>
        </div>
      </div>
    </Card>
  );
};

export default AccountElements;
