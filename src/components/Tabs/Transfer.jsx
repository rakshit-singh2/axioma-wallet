import React, { useState } from "react";
import { Input, Button, Spin, Tooltip } from "antd";
import { Web3 } from 'web3';
import { addTransaction, getChain, getWalletData } from "../../helpers/storage";
import { decryptData } from "../../helpers/encryption";
import { message } from 'antd'


// Translate 
import { useTranslation } from 'react-i18next';

// Translate

const Transfer = ({ walletAddress, selectedChain }) => {
	
	// Translate
	const { t, i18n } = useTranslation();
	const handleLanguageChange = (event) => {
	i18n.changeLanguage(event.target.value);
	};
	// Translate
  const [amountToSend, setAmountToSend] = useState(null);
  const [sendToAddress, setSendToAddress] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [hash, setHash] = useState(null);

  const sendTransaction = async (to, amount) => {
    try {
      if(walletAddress==to){
        throw new Error("Sender Address is same as reciever address");
      }
      setProcessing(true);
      const chain = await getChain(selectedChain);
      const web3 = new Web3(chain.rpcUrl);
      const walletData = await getWalletData(walletAddress);
      const privateKey = await decryptData(walletData.walletKey);
      const gasPrice = await web3.eth.getGasPrice();
      const gas = await web3.eth.estimateGas({
        from: walletAddress,
        to: to,
        value: web3.utils.toWei(amount, 'ether')
      });

      const txObject = {
        from: walletAddress,
        to: to,
        gas,
        gasPrice: gasPrice,
        value: web3.utils.toWei(amount, 'ether')
      };

      const signedTransaction = await web3.eth.accounts.signTransaction(
        txObject,
        privateKey
      );

      const transaction = await web3.eth.sendSignedTransaction(
        signedTransaction.rawTransaction
      );
      setHash(transaction.transactionHash);
      message.success(`Transaction successful with Transaction Hash: ${transaction.transactionHash}`);
      setAmountToSend('');
      setSendToAddress('');
      addTransaction(walletAddress, transaction, chain.name, amount);
    } catch (err) {
      console.log("Error:", err);
      setHash(null);
      message.error(`Transaction failed: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };


  return (
    <>
      <div className="sendRow">
        <p style={{ width: "90px", textAlign: "left" }}> {t('To')}:</p>
        <Input
          value={sendToAddress}
          onChange={(e) => setSendToAddress(e.target.value)}
          placeholder="0x..."
        />
      </div>
      <div className="sendRow">
        <p style={{ width: "90px", textAlign: "left" }}> {t('Amount')}:</p>
        <Input
          value={amountToSend}
          onChange={(e) => setAmountToSend(e.target.value)}
          placeholder={t('Amount')}
        />
      </div>
      <Button
        style={{ width: "100%", marginTop: "20px", marginBottom: "20px" }}
        type="primary"
        onClick={() => sendTransaction(sendToAddress, amountToSend)}
        disabled={processing}
      >
		{t('Send Tokens')}
      </Button>
      {processing && (
        <>
          <Spin />
          {hash && (
            <Tooltip title={hash}>
              <p>{t('Hover For Tx Hash')}</p>
            </Tooltip>
          )}
        </>
      )}
    </>
  );
};

export default Transfer;
