import React, { useState, useEffect } from "react";
import { List, Spin, Alert, Typography } from "antd";
import { getTransactions, getAllChains } from "../../helpers/storage";
import CopyButton from "../CopyButton";
// Translate 
import { useTranslation } from 'react-i18next';
// Translate
const { Text, Link } = Typography;

const TransactionHistory = ({ walletAddress, selectedChain }) => {
	// Translate
	const { t, i18n } = useTranslation();
	const handleLanguageChange = (event) => {
	i18n.changeLanguage(event.target.value);
	};
	// Translate
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chain, setChain] = useState(null);

  useEffect(() => {
    const initializeChain = async () => {
      try {
        const AllChains = await getAllChains();
        setChain(AllChains[selectedChain]);
      } catch (error) {
        console.error("Error initializing chain:", error);
      }
    };

    initializeChain();
  }, [selectedChain]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!walletAddress || !chain) return;

      setLoading(true);
      setError(null);

      try {
        const txs = await getTransactions(walletAddress, chain.name);
        setTransactions(txs);
      } catch (error) {
        setError("Error fetching transactions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [walletAddress, chain]);

  return (
    <Spin spinning={loading} tip="Loading transactions...">
      {error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : (
        transactions && transactions.length > 0 ? (
          <List
            bordered
            itemLayout="horizontal"
            dataSource={transactions}
            renderItem={(item) => (
              <List.Item style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <List.Item.Meta
                    title={
                      <div>
                        <Text strong> {t('Hash')} : </Text>
                        <Text code>
                          {item.transactionHash.slice(0, 6)}...{item.transactionHash.slice(-4)}
                        </Text>
                      </div>
                    }
                    description={
                      <div>
                        <Text>{t('To')}: {item.to.slice(0, 6)}...{item.to.slice(-4)}</Text>
                        <br />
                        <Text>{t('Amount')}: {parseFloat(item.amount).toFixed(4)} {chain.ticker}</Text>
                      </div>
                    }
                  />
                </div>
                <div>
                  <CopyButton content={item.transactionHash} style={{ marginLeft: 10 }} />
                  <Link href={`${chain?.blockExplorerUrl}/tx/${item.transactionHash}`} target="_blank" rel="noopener noreferrer">
                   {t('View Transaction')} 
                  </Link>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Text> {t('No transactions yet')}</Text>
        )
      )}
    </Spin>
  );
};

export default TransactionHistory;
