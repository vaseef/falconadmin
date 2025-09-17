
import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Set the backend base URL globally
//axios.defaults.baseURL = 'https://localhost:7045';
axios.defaults.baseURL = 'https://falconadmin-backend.azurewebsites.net/';
// path set

interface LoginProps {
    onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Check localStorage for existing authentication state
    React.useEffect(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        if (storedAuth === 'true') {
            // If already authenticated, redirect to dashboard
            //navigate('/dashboard'); 
        }
    }, [navigate]);

    const handleLogin = async () => {
        try {
            const response = await axios.post('/api/auth/login', { username, password });
            if (response.status === 200) {
                // Successful login: Store authentication status in localStorage
                localStorage.setItem('isAuthenticated', 'true');
                onLoginSuccess(); // Notify App component about successful login
                navigate('/dashboard'); // Redirect to dashboard
            }
        } catch (error) {
            setError("Login failed. Please check your username and password.");
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5rem' }}>
            <Typography variant="h4">Login</Typography>
            <TextField 
                label="Username" 
                margin="normal" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            />
            <TextField 
                label="Password" 
                type="password" 
                margin="normal" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <Button variant="contained" color="primary" onClick={handleLogin}>Login</Button>
            {error && <Typography color="error">{error}</Typography>}
        </div>
    );
};

export default Login;








/*
import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Set the backend base URL globally
//axios.defaults.baseURL = 'https://localhost:7045';
axios.defaults.baseURL = 'https://falconadmin-backend.azurewebsites.net/';



interface LoginProps {
    onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('/api/auth/login', { username, password });
            if (response.status === 200) {
                onLoginSuccess(); // Notify App component about successful login
                navigate('/dashboard'); // Redirect to dashboard
            }
        } catch (error) {
            setError("Login failed. Please check your username and password.");
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5rem' }}>
            <Typography variant="h4">Login</Typography>
            <TextField label="Username" margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField label="Password" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button variant="contained" color="primary" onClick={handleLogin}>Login</Button>
            {error && <Typography color="error">{error}</Typography>}
        </div>
    );
};

export default Login;

*/