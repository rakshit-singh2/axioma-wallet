import React, { useState } from "react";
import { Button, Modal, Space, Tooltip } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Web3 } from "web3";
import AccountDetailsView from "./AccountDetailsView";
import AddAccountView from "./AddAccountView";
import ImportAccountView from "./ImportAccountView";
import AccountList from "./AccountList";
import { createAccountEntry, countAccounts, getWalletData, setChildCount, getChildCount } from "../../helpers/storage";
import { encryptData, decryptData } from "../../helpers/encryption";
import { Mnemonic, HDNodeWallet } from "ethers";

const AccountDropdown = ({ walletAddress, setWalletAddress, selectedChain }) => {
  const web3 = new Web3();
  const [modalOpen, setModalOpen] = useState(false);
  const [addAccountView, setAddAccountView] = useState(false);
  const [importAccountView, setImportAccountView] = useState(false);
  const [accountDetailsView, setAccountDetailsView] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [infoViewAccount, setInfoViewAccount] = useState("");
  const [infoViewAccountPrivateKey, setInfoViewAccountPrivateKey] = useState("");

  const handleMenuClick = (item) => {
    setWalletAddress(item.address);
    setModalOpen(false);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setAddAccountView(false);
    setImportAccountView(false);
    setAccountDetailsView(false);
    setShowPrivateKey(false);
    setInfoViewAccount("");
  };

  const handleAddAccountClick = () => {
    setAddAccountView(true);
    setModalOpen(true);
  };

  const handleImportAccountClick = () => {
    setImportAccountView(true);
    setAddAccountView(false);
  };

  const addChildAccount = async () => {
    const i = await getChildCount();
    const index = parseInt(decryptData(i));
    const encryptedMnemonic = localStorage.getItem("SeedPhrase");
    const decryptedMnemonic = decryptData(encryptedMnemonic);
    const mnemonicInstance = Mnemonic.fromPhrase(decryptedMnemonic);
    const childWallet = HDNodeWallet.fromMnemonic(mnemonicInstance, `m/44'/60'/0'/0/${index}`);
    const count = await countAccounts();
    createAccountEntry(childWallet.address, `Account ${count + 1}`, encryptData(childWallet.privateKey));
    setChildCount(encryptData((index + 1).toString()));
    setWalletAddress(childWallet.address);
    setAddAccountView(false);
    setModalOpen(false);
  };

  const importFromPrivateKey = async () => {
    const formattedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
    const account = web3.eth.accounts.privateKeyToAccount(formattedPrivateKey);
    const count = await countAccounts();
    createAccountEntry(account.address, `Account ${count + 1}`, encryptData(account.privateKey));
    setWalletAddress(account.address);
    setImportAccountView(false);
    setAddAccountView(false);
    setModalOpen(false);
    setPrivateKey("");
  };

  const getPrivateKey = async () => {
    try {
      const walletData = await getWalletData(infoViewAccount);
      return decryptData(walletData.walletKey);
    } catch (error) {
      console.error("Failed to get private key:", error);
      return "";
    }
  };

  const handleShowPrivateKey = async () => {
    if (!showPrivateKey) {
      const key = await getPrivateKey();
      setInfoViewAccountPrivateKey(key);
    }
    setShowPrivateKey(!showPrivateKey);
  };

  return (
    <Space wrap>
      <Button
        onClick={handleModalOpen}
        icon={<UserOutlined />}
        type="primary"
        style={{ backgroundColor: "white", color: "black" }}
      >
        <Tooltip title={walletAddress}>
          {`${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`}
        </Tooltip>
      </Button>

      <Modal
        title={accountDetailsView ? '' : addAccountView ? "Add Account" : importAccountView ? "Import Account" : "Select an Account"}
        open={modalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={300}
        closable={false}
        centered
      >
        {accountDetailsView ? (
          <AccountDetailsView
            walletAddress={infoViewAccount}
            privateKey={infoViewAccountPrivateKey}
            showPrivateKey={showPrivateKey}
            handleShowPrivateKey={handleShowPrivateKey}
          />
        ) : addAccountView ? (
          <AddAccountView
            addChildAccount={addChildAccount}
            handleImportAccountClick={handleImportAccountClick}
          />
        ) : importAccountView ? (
          <ImportAccountView
            privateKey={privateKey}
            setPrivateKey={setPrivateKey}
            importFromPrivateKey={importFromPrivateKey}
          />
        ) : (
          <AccountList
            selectedChain={selectedChain}
            walletAddress={walletAddress}
            setAccountDetailsView={setAccountDetailsView}
            setInfoViewAccount={setInfoViewAccount}
            handleMenuClick={handleMenuClick}
            handleAddAccountClick={handleAddAccountClick}
          />
        )}
      </Modal>
    </Space>
  );
};

export default AccountDropdown;
