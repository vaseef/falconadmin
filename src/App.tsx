import React, { useState, useEffect } from 'react';
//import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import UploadPage from './components/UploadPage';
import ConfigManager from './components/ConfigManager';
import Last7Days from './components/Last7Days';
import DayReport from './components/DayReport';
import PendingAmounts from './components/PendingAmounts';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import MonthlyReport from './components/MonthlyReport';
import InvoiceGenerate from './components/InvoiceGenerate';
import AddressBook from './components/AddressBook';
import InvoiceGenerateTest from './components/InvoiceGenerateTest';

//import { Upload } from '@mui/icons-material';

const queryClient = new QueryClient();

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    // Check localStorage for authentication status on component mount
    useEffect(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        if (storedAuth === 'true') {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []); // Empty dependency array ensures this runs only once on component mount

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
    };

    return (
        <QueryClientProvider client={queryClient}>
            <Router basename="/falconadmin">
                <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                    <AppBar position="static" style={{ backgroundColor: 'black' }}>
                        <Toolbar style={{ justifyContent: 'space-between' }}>
                            <Typography variant="h6" style={{ color: 'white', padding: '1rem', margin:0 }}>
                                Falcon Sports
                            </Typography>
                            {isAuthenticated && (
                                <Box>
                                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                                </Box>
                            )}
                        </Toolbar>
                    </AppBar>

                    <div style={{ display: 'flex', flexGrow: 1 }}>
                        {isAuthenticated && <Sidebar />}
                        <main
                            style={{
                                flexGrow: 1,
                                padding: '1rem',
                                backgroundColor: 'offwhite',
                            }}
                        >
                        <Routes>
                            <Route
                                path="/"
                                element={
                                isAuthenticated ? (
                                    <Dashboard />
                                ) : (
                                    <Login onLoginSuccess={handleLoginSuccess} />
                                )
                                }
                            />
                            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                        {/* Your other routes */}
                        <Route
                            path="Dashboard"
                            element={isAuthenticated ? <Dashboard /> : <Login onLoginSuccess={handleLoginSuccess} />}
                        />
                        <Route
                            path="dayreport"
                            element={isAuthenticated ? <DayReport /> : <Login onLoginSuccess={handleLoginSuccess} />}
                        />
                        <Route
                            path="Last7Days"
                            element={isAuthenticated ? <Last7Days /> : <Login onLoginSuccess={handleLoginSuccess} />}
                        />
                        <Route
                            path="monthlyreport"
                            element={isAuthenticated ? <MonthlyReport /> : <Login onLoginSuccess={handleLoginSuccess} />}
                        />
                        <Route
                            path="PendingAmounts"
                            element={isAuthenticated ? <PendingAmounts /> : <Login onLoginSuccess={handleLoginSuccess} />}
                        />
                        <Route
                            path="InvoiceGenerate"
                            element={isAuthenticated ? <InvoiceGenerate /> : <Login onLoginSuccess={handleLoginSuccess} />}
                        />
                        <Route
                            path="UploadPage"
                            element={isAuthenticated ? <UploadPage /> : <Login onLoginSuccess={handleLoginSuccess} />}
                        />
                        <Route
                            path="ConfigManager"
                            element={isAuthenticated ? <ConfigManager /> : <Login onLoginSuccess={handleLoginSuccess} />}
                        />
                        <Route
                            path="AddressBook"
                            element={isAuthenticated ? <AddressBook /> : <Login onLoginSuccess={handleLoginSuccess} />}
                        />
                        <Route
                            path="InvoiceGenerateTest"
                            element={isAuthenticated ? <InvoiceGenerateTest /> : <Login onLoginSuccess={handleLoginSuccess} />}
                        />
                        {/* catch-all */}
                        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
                        </Routes>
                        </main>
                    </div>
                </div>
            </Router>
        </QueryClientProvider>
    );
};

export default App;
