import React from "react";
import { LockFilled } from "@ant-design/icons";
import { Button } from 'antd';
import { deleteLocalStorageItem } from "../helpers/storage";
// import { useNavigate } from 'react-router-dom';

const LockButton = () => {
  // const navigate = useNavigate();
  const handleClick = () => {
    deleteLocalStorageItem('loggedIn');
    window.location.reload(); // Reload the page after clearing the storage
    // navigate("/");
  };

  return (
    <div className="header">
      <Button
        onClick={handleClick}
        style={{ background: 'none', border: 'none', outline: 'none', boxShadow: 'none' }}
        icon={<LockFilled />}
      />
    </div>
  );
};

export default LockButton;
