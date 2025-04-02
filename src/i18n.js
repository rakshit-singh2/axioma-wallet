// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation files for different languages
const resources = {
  en: {
    translation: {
      "Alvey Wallet": "Alvey Wallet",
      "Your assets, your control – Alvey Chain’s decentralized wallet solution": "Your assets, your control – Alvey Chain’s decentralized wallet solution",
      "Amount": "Amount",
      "Language": "Language",
      "Create A Wallet": "Create A Wallet",
      "Sign In With Seed Phrase": "Sign In With Seed Phrase",
      "Back Home": "Back Home",
      "Type your seed phrase here...": "Type your seed phrase here...",
      "Open Your New Wallet": "Open Your New Wallet",
	  "Generate Seed Phrase": "Generate Seed Phrase",
	  "Once you generate the seed phrase, save it securely in order to recover your wallet in the future.": "Once you generate the seed phrase, save it securely in order to recover your wallet in the future.",
	  "Type your seed phrase in the field below to recover your wallet (it should include 12 words separated with spaces).": "Type your seed phrase in the field below to recover your wallet (it should include 12 words separated with spaces).",
	  "Recover Wallet": "Recover Wallet",
	  "Set Password": "Set Password",
	  "Set Your Password": "Set Your Password",
	  "Please Enter a Password": "Please Enter a Password",
	  "Confirm your password": "Confirm your password",
	  "Account address": "Account address",
	  "Private Key": "Private Key",
	  "Hide Private Key": "Hide Private Key",
	  "Show Private Key": "Show Private Key",
	  "Forgot Password? Click Here to reset": "Forgot Password? Click Here to reset",
	  "Please Enter Your Password": "Please Enter Your Password",
	  "Enter Your Password": "Enter Your Password",
	  "Login": "Login",
	  "Login through Password": "Login through Password",
	  "Please click to logout": "Please click to logout",
	  "If you have forgotten your seed phase, it cannot be recovered. Please Logout to continue.": "If you have forgotten your seed phase, it cannot be recovered. Please Logout to continue.",
	  "Reset Password": "Reset Password",
	  "Type your seed phrase in the field below to reset your password.": "Type your seed phrase in the field below to reset your password.",
	  "Transfer": "Transfer",
	  "History": "History",
	  "Tokens": "Tokens",
	  "NFTs": "NFTs",
	  "Send Tokens": "Send Tokens",
	  "Hover For Tx Hash": "Hover For Tx Hash",
	  "To": "To",
	  "You seem to not have any tokens yet. Please import tokens to view": "You seem to not have any tokens yet. Please import tokens to view",
	  "Tokens": "Tokens",
	  "Add account": "Add account",
	  "Import Account": "Import Account",
	  "Balance": "Balance",
	  "Add Chain": "Add Chain",
	  "Add Token": "Add Token",
	  "Contract Address Of ERC20": "Contract Address Of ERC20",
	  "No NFTs imported yet. Please import NFTs to view.": "No NFTs imported yet. Please import NFTs to view.",
	  "View NFT": "View NFT",
	  "Add NFT": "Add NFT",
	  "Contract Address of NFT": "Contract Address of NFT",
	  "No transactions yet": "No transactions yet",
	  "Select a Chain": "Select a Chain",
	  "View Transaction": "View Transaction",
	  "Hash": "Hash",
	  "Name": "Name",
	  "Ticker": "Ticker",
	  "RPC URL": "RPC URL",
	  "Block Explorer URL": "Block Explorer URL"
    }
  },
  cn: {
    translation: {
      "Alvey Wallet": "阿尔维钱包",
      "Your assets, your control – Alvey Chain’s decentralized wallet solution": "你的资产，你的掌控——Alvey Chain的去中心化钱包解决方案",
      "Amount": "数量",
      "To": "到",
      "Language": "语言",
      "Create A Wallet": "创建钱包",
      "Sign In With Seed Phrase": "使用助记词登录",
      "Back Home": "返回首页",
      "Type your seed phrase here...": "在此输入您的助记词...",
	  "Open Your New Wallet": "打开你的新钱包",
	  "Generate Seed Phrase": "生成种子短语",
	  "Once you generate the seed phrase, save it securely in order to recover your wallet in the future.": "生成助记词后，请将其安全保存，以便将来恢复您的钱包。",
	  "Type your seed phrase in the field below to recover your wallet (it should include 12 words separated with spaces).": "在下面的字段中输入您的助记词以恢复您的钱包（它应包含 12 个单词，并用空格分隔）。",
	  "Recover Wallet": "恢复钱包",
	  "Set Password": "设置密码",
	  "Set Your Password": "设置您的密码",
	  "Please Enter a Password": "请输入密码",
	  "Confirm your password": "确认您的密码",
	  "Account address": "账户地址",
	  "Private Key": "私钥",
	  "Hide Private Key": "隐藏私钥",
	  "Show Private Key": "显示私钥",
	  "Forgot Password? Click Here to reset": "忘记密码？单击此处重置",
	  "Please Enter Your Password": "请输入您的密码",
	  "Enter Your Password": "输入您的密码",
	  "Login": "登录",
	  "Login through Password": "通过密码登录",
	  "Please click to logout": "请点击退出",
	  "If you have forgotten your seed phase, it cannot be recovered. Please Logout to continue.": "如果您忘记了种子阶段，则无法恢复。请退出以继续。",
	  "Reset Password": "重置密码",
	  "Type your seed phrase in the field below to reset your password.": "在下面的字段中输入您的助记词以重置您的密码。",
	  "Transfer": "转移",
	  "History": "历史",
	  "Tokens": "代币",
	  "NFTs": "NFT",
	  "Send Tokens": "发送代币",
	  "Hover For Tx Hash": "将鼠标悬停在 Tx 哈希上",
	  "You seem to not have any tokens yet. Please import tokens to view": "您似乎还没有任何令牌。请导入token才能查看",
	  "Tokens": "代币",
	  "Balance": "平衡",
	  "Add account": "添加帐户",
	  "Import Account": "进口账户",
	  "Add Chain": "添加链",
	  "Add Token": "添加令牌",
	  "Contract Address Of ERC20": "ERC20合约地址",
	  "No NFTs imported yet. Please import NFTs to view.": "尚未导入 NFT。请导入NFT进行查看。",
	  "View NFT": "查看 NFT",
	  "Add NFT": "添加NFT",
	  "Contract Address of NFT": "NFT合约地址",
	  "No transactions yet": "還沒有交易",
	  "Select a Chain": "选择一条链条",
	  "View Transaction": "查看交易",
	  "Hash": "哈希值",
	  "Name": "姓名",
	  "Ticker": "股票行情指示器",
	  "RPC URL": "遠端過程呼叫位址",
	  "Block Explorer URL": "區塊資源管理器 URL"
      
    }
  }
};

// Get the language from localStorage, or default to 'en'
const storedLanguage = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: storedLanguage, // Set the language from localStorage or default to 'en'
    fallbackLng: 'en', // fallback language if translation is missing
    interpolation: {
      escapeValue: false // React already handles escaping
    }
  });

export default i18n;
