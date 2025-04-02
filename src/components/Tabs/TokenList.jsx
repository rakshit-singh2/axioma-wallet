import React, { useEffect, useState } from "react";
import { Input, Button, List, Avatar, Spin, message } from "antd";
import { ethers } from "ethers";
import { addToken, getTokens, getAllChains } from "../../helpers/storage";
import CopyButton from "../CopyButton";
// Translate 
import { useTranslation } from 'react-i18next';
// Translate

const TokenList = ({ walletAddress, selectedChain }) => {
	// Translate
	const { t, i18n } = useTranslation();
	const handleLanguageChange = (event) => {
	i18n.changeLanguage(event.target.value);
	};
	// Translate
    const [contractAddress, setContractAddress] = useState("");
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [provider, setProvider] = useState(null);
    const [chain, setChain] = useState(null);

    useEffect(() => {
        const initialize = async () => {
            try {
                const AllChains = await getAllChains();
                const selectedChainData = AllChains[selectedChain];
                setChain(selectedChainData);

                if (selectedChainData) {
                    const newProvider = new ethers.JsonRpcProvider(selectedChainData.rpcUrl);
                    setProvider(newProvider);
                }
            } catch (error) {
                console.error("Error initializing chain and provider:", error);
            }
        };

        initialize();
    }, [selectedChain]);

    useEffect(() => {
        if (walletAddress && provider && chain) {
            fetchTokens();
        }
    }, [walletAddress, provider, chain]);

    const erc20ABI = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function totalSupply() view returns (uint256)",
        "function decimals() view returns (uint8)",
        "function balanceOf(address) view returns (uint256)",
    ];

    const fetchTokens = async () => {
        try {
            setLoading(true);
            setError("");

            const fetchedTokens = await getTokens(walletAddress, selectedChain);
            const updatedTokens = await Promise.all(fetchedTokens.map(async (token) => {
                try {
                    const contract = new ethers.Contract(token.address, erc20ABI, provider);
                    const balance = await contract.balanceOf(walletAddress);
                    const name = await contract.name();
                    const symbol = await contract.symbol();
                    const decimals = await contract.decimals();
                    return {
                        ...token,
                        balance,
                        name,
                        symbol,
                        decimals: parseInt(decimals),
                        logo: `public/svg/color/${symbol.toLowerCase()}.svg` // Add your logo logic here
                    };
                } catch (error) {
                    console.error("Error fetching token details:", error);
                    return token; // Return original token object in case of error
                }
            }));

            setTokens(updatedTokens);
        } catch (err) {
            console.error("Error fetching tokens:", err);
            setError("Error fetching tokens. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const addContract = async (address) => {
        try {
            setLoading(true);
            setError("");

            const tokenInfo = await checkErc20(address);
            if (tokenInfo) {
                await addToken(walletAddress, tokenInfo);
                await fetchTokens(); // Re-fetch tokens to update the list
            } else {
                message.error("Not an ERC20 Contract");
            }
        } catch (err) {
            message.error(`Error adding contract: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const checkErc20 = async (address) => {
        try {
            const contract = new ethers.Contract(address, erc20ABI, provider);
            const name = await contract.name();
            const symbol = await contract.symbol();
            const totalSupply = await contract.totalSupply();
            const decimals = await contract.decimals();

            if (name && symbol && totalSupply && decimals !== undefined) {
                return {
                    name,
                    symbol,
                    totalSupply: totalSupply.toString(),
                    decimals: decimals.toString(),
                    chain: selectedChain,
                    address: address,
                };
            } else {
                return false;
            }
        } catch (error) {
            console.error("Error fetching ERC-20 token information:", error);
            return false;
        }
    };

    return (
        <>
            <Input
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder={t('Contract Address Of ERC20')}
            />
            <Button
                style={{ width: "100%", marginTop: "20px", marginBottom: "20px" }}
                type="primary"
                onClick={() => addContract(contractAddress)}
                disabled={loading}
            >
                {loading ? "Adding..." : t('Add Token')}
            </Button>
            {loading ? (
                <Spin size="large" />
            ) : error ? (
                <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
            ) : tokens && tokens.length > 0 ? (
                <List
                    bordered
                    itemLayout="horizontal"
                    dataSource={tokens}
                    renderItem={(item) => (
                        <List.Item style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ flex: 1 }}>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.logo || ""} />}
                                    title={item.symbol}
                                    description={item.name}
                                />
                            </div>
                            <div style={{ flex: 1, textAlign: "right" }}>
                                <div>
                                    {t('Balance')}: {(Number(item.balance) / 10 ** Number(item.decimals)).toFixed(2)} {t('Tokens')} 
                                </div>
                                <CopyButton content={item.address} />
                            </div>
                        </List.Item>
                    )}
                />
            ) : (
                <span>{t('You seem to not have any tokens yet. Please import tokens to view')}</span>
            )}
        </>
    );
};

export default TokenList;
