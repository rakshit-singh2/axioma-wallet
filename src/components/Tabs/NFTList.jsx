import React, { useEffect, useState } from "react";
import { Input, Button, List, Avatar, Spin, message } from "antd";
import { ethers } from "ethers";
import { addNFT, getNFTs, getAllChains } from "../../helpers/storage";
import NFTabi from '../../ABI/NFTabi.json';
import CopyButton from "../CopyButton";
// Translate 
import { useTranslation } from 'react-i18next';
// Translate

const NFTList = ({ walletAddress, selectedChain }) => {
	 // Translate
	const { t, i18n } = useTranslation();
	const handleLanguageChange = (event) => {
	i18n.changeLanguage(event.target.value);
	};
	// Translate
  const [contractAddress, setContractAddress] = useState("");
  const [nftId, setNftId] = useState("");
  const [nfts, setNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chain, setChain] = useState(null);

  useEffect(() => {
    const fetchChains = async () => {
      try {
        const AllChains = await getAllChains();
        setChain(AllChains[selectedChain]);
      } catch (err) {
        console.error("Error fetching chains:", err);
        setError("Error fetching chains. Please try again.");
      }
    };

    fetchChains();
  }, [selectedChain]);

  useEffect(() => {
    if (!walletAddress || !chain) return;
    fetchNFTs();
  }, [walletAddress, chain]);

  const provider = chain ? new ethers.JsonRpcProvider(chain.rpcUrl) : null;

  const fetchNFTs = async () => {
    if (!provider) return;

    try {
      setLoading(true);
      setError("");
  
      const fetchedNFTs = await getNFTs(walletAddress, selectedChain);
      const updatedNFTs = await Promise.all(
        fetchedNFTs.map(async (nft) => {
          try {
            const contract = new ethers.Contract(nft.address, NFTabi, provider);
            const balance = await contract.balanceOf(walletAddress);
            const name = await contract.name();
            const symbol = await contract.symbol();
            const tokenURI = await contract.tokenURI(0);
            return {
              ...nft,
              balance: balance.toString(), // Convert balance to string
              name,
              symbol,
              tokenURI,
              logo: '',
            };
          } catch (error) {
            console.error("Error fetching NFT details:", error);
            return { ...nft, error: "Failed to fetch details" }; // Preserve NFT even if details fetch fails
          }
        })
      );
  
      setNFTs(updatedNFTs);
    } catch (err) {
      console.error("Error fetching NFTs:", err);
      setError("Error fetching NFTs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addContract = async (address) => {
    try {
      setLoading(true);
      setError("");
  
      const NFTinfo = await checkNFT(address);
      if (NFTinfo) {
        await addNFT(walletAddress, NFTinfo);
        await fetchNFTs();
      } else {
        message.error("Not an NFT Contract");
      }
  
    } catch (err) {
      console.error(`Error adding contract: ${err}`);
      message.error(`Error adding contract: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkNFT = async (address) => {
    try {
      const contract = new ethers.Contract(address, NFTabi, provider);
      const name = await contract.name();
      const symbol = await contract.symbol();
      const supportsERC721 = await contract.supportsInterface("0x80ac58cd");
      const nftInterfase = supportsERC721;
      if (nftInterfase && name && symbol) {
        return {
          name,
          symbol,
          chain: selectedChain,
          address: address,
        };
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error fetching NFT information:", error);
      return false;
    }
  };

  return (
    <>
      <Input
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
        placeholder={t('Contract Address of NFT')}
      />
      <Input
        value={nftId}
        onChange={(e) => setNftId(e.target.value)}
        placeholder="NFT ID"
      />
      <Button
        style={{ width: "100%", marginTop: "20px", marginBottom: "20px" }}
        type="primary"
        onClick={() => addContract(contractAddress)}
        disabled={loading}
      >
        {loading ? "Adding..." : t('Add NFT')}
      </Button>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      ) : nfts.length > 0 ? (
        <List
          bordered
          itemLayout="horizontal"
          dataSource={nfts}
          renderItem={(item) => (
            <List.Item style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ flex: 1 }}>
                <List.Item.Meta
                  avatar={<Avatar src={item.logo || ""} />}
                  title={item.symbol}
                  description={item.name}
                />
                <div>
                  <a href={item.tokenURI} target="_blank" rel="noopener noreferrer">
                   {t('View NFT')} 
                  </a>
                </div>
              </div>
              <div style={{ flex: 1, textAlign: "right" }}>
                <CopyButton content={item.address}/>
              </div>
            </List.Item>
          )}
        />
      ) : (
        <span>{t('No NFTs imported yet. Please import NFTs to view.')}</span>
      )}
    </>
  );
};

export default NFTList;
