import React from "react";
import { LogoutOutlined } from "@ant-design/icons";
import { Button } from 'antd';
import { clearLocalStorage, clearIndexedDB} from "../helpers/storage";
// import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ setSeedPhrase, setWallet, setBalance }) => {
  // const navigate = useNavigate();

  const logout = () => {
    clearLocalStorage();
    clearIndexedDB()
      .then(() => {
        setSeedPhrase(null);
        setWallet(null);
        setBalance(0);
      })
      .catch((error) => {
        console.error("Error clearing IndexedDB:", error);
      });
      window.location.reload()
      // navigate("/");
  };

  return (
    <div className="header">
      <Button
        onClick={logout}
        style={{ background: 'none', border: 'none', outline: 'none', boxShadow: 'none' }}
        icon={<LogoutOutlined />}
      />
    </div>
  );
};

export default LogoutButton;
