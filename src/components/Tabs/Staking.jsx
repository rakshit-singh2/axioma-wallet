import React, { useState } from 'react';
import { Button, Container, Card, Form } from 'react-bootstrap';

const Staking = ({ walletAddress, selectedChain }) => {
  const [amount, setAmount] = useState('');
  const [pendingRewards, setPendingRewards] = useState(0);

  const handleStake = () => {
    console.log(`Staking ${amount} tokens on ${selectedChain}`);
    // Add staking logic here
  };

  const handleUnstake = () => {
    console.log(`Unstaking tokens on ${selectedChain}`);
    // Add unstaking logic here
  };

  const handleCheckRewards = () => {
    console.log(`Checking rewards for ${walletAddress}`);
    // Simulated reward check logic
    setPendingRewards(Math.floor(Math.random() * 100));
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow">
        <Card.Title>Staking Dashboard</Card.Title>        
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Amount to Stake</Form.Label>
            <Form.Control 
              type="number" 
              placeholder="Enter amount" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
            />
          </Form.Group>
        </Form>
        
        <Button variant="primary" className="me-2" onClick={handleStake}>Stake</Button>
        <Button variant="danger" className="me-2" onClick={handleUnstake}>Unstake</Button>
        <Button variant="info" onClick={handleCheckRewards}>Check Rewards</Button>
        
        <Card.Text className="mt-3">Pending Rewards: {pendingRewards} Tokens</Card.Text>
      </Card>
    </Container>
  );
};

export default Staking;