import React from 'react';
import { Button, Input } from 'antd';

const ImportAccountView = ({ privateKey, setPrivateKey, importFromPrivateKey }) => {
  return (
    <>
      <Input value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} placeholder="Private Key" />
      <Button onClick={importFromPrivateKey}>Import Account</Button>
    </>
  );
};

export default ImportAccountView;
