import React, { useEffect, useState } from "react";
import { Button } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Web3 } from "web3";
import AccountElements from './AccountElements';
import { getAllAccounts, getChain } from "../../helpers/storage";

const AccountList = ({ selectedChain, walletAddress, setAccountDetailsView, setInfoViewAccount, handleMenuClick, handleAddAccountClick }) => {
  const [accountItems, setAccountItems] = useState([]);
  
  useEffect(() => {
    const listAllAccounts = async () => {
      try {
        const allAccounts = await getAllAccounts();
        const currChain =  await getChain(selectedChain);
        const web3 = new Web3(currChain?.rpcUrl);
        const weiBalance = await web3.eth.getBalance(walletAddress);
        const etherBalance = web3.utils.fromWei(weiBalance, 'ether');
        const roundedBalance = parseFloat(etherBalance).toFixed(3);
        if (allAccounts && allAccounts.length > 0) {
          const items = await Promise.all(
            allAccounts.map(async (account) => {
              const ticker = currChain.ticker;
              return {
                ...account,
                label: account.name,
                key: account.address,
                icon: <UserOutlined />,
                balance:roundedBalance,
                ticker
              };
            })
          );
          setAccountItems(items);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };
    listAllAccounts();
  }, []);
  return (
    <>
      <div style={{ maxHeight: 'calc(60vh - 50px)', overflowY: 'scroll', scrollbarWidth: 'none' }}>
        {accountItems
          .filter((item) => item.key !== 'addAccount')
          .map((item) => (
            <div key={item.key}>
              <AccountElements
                account={item}
                balance={item.balance}
                selectedChain={selectedChain}
                walletAddress={walletAddress}
                setAccountDetailsView={setAccountDetailsView}
                setInfoViewAccount={setInfoViewAccount}
                onClick={() => handleMenuClick(item)}
              />
            </div>
          ))}
      </div>
      <Button style={{ width: "100%", marginTop: "20px" }} type="primary" onClick={handleAddAccountClick}>
        <PlusOutlined /> <b>Add Account</b>
      </Button>
    </>
  );
};

export default AccountList;
