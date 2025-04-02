import React, { useState, useEffect } from "react";
import { Button, Input, Typography, Card, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { getPass, getTemporaryLocalStorage, setTemporaryLocalStorage } from '../helpers/storage';
import { decryptData } from "../helpers/encryption";
// Translate 
import { useTranslation } from 'react-i18next';
// Translate

const { Title } = Typography;

function EnterPassword() {
	// Translate
	const { t, i18n } = useTranslation();
	const handleLanguageChange = (event) => {
	i18n.changeLanguage(event.target.value);
	};
	// Translate
    const navigate = useNavigate();
    const [password, setPassword] = useState('');

    useEffect(() => {
        const loggedIn = getTemporaryLocalStorage('loggedIn');
        if (loggedIn) {
            navigate("/wallet");
        }
    }, [navigate]);

    async function handleEnterPassword() {
        try {
            const pass = await getPass();
            const storedPassword = decryptData(pass);
            if (storedPassword === password) {
                setTemporaryLocalStorage("loggedIn", true,(1));
                navigate("/wallet");
            } else {
                message.error("Wrong Password");
            }
        } catch (error) {
            message.error("An error occurred while processing the password.");
            console.error("Password handling error:", error);
        }
    }

    return (
        <div className="enter-password-container">
            <Card bordered={false} style={{ width: 400, margin: 'auto', padding: '20px' }}>
                <Title level={2} style={{ textAlign: 'center' }}>{t('Enter Your Password')}</Title>
                <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('Please Enter Your Password')}
                    type="password"
                    style={{ marginBottom: '16px' }}
                />
                <Button
                    className="frontPageButton"
                    type="primary"
                    block
                    onClick={handleEnterPassword}
                >
                    {t('Login')}
                </Button>
            </Card>
            <Link to="/resetPassword">{t('Forgot Password? Click Here to reset')}</Link>
            
        </div>
    );
}

export default EnterPassword;
