import React, { useEffect, useState } from 'react';
import {
    Button,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
    Box,
} from '@mui/material';
import axios from 'axios';

interface ConfigItem {
    id: string;
    key: string;
    value: string;
}

const ConfigManager = () => {
    const [configData, setConfigData] = useState<ConfigItem[]>([]);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [currentKey, setCurrentKey] = useState('');
    const [currentValue, setCurrentValue] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(true); // Loading state

    const fetchConfigData = async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.get<ConfigItem[]>('/api/config');
            setConfigData(response.data);
        } catch (error) {
            console.error("Error fetching configuration data:", error);
            alert("Failed to load configuration data.");
        } finally {
            setLoading(false); // End loading
        }
    };

    const handleSave = async () => {
        if (!currentKey || !currentValue) {
            alert("Key and Value are required.");
            return;
        }

        try {
            if (isEditMode) {
                await axios.put(`/api/config/${currentKey}`, { value: currentValue });
            } else {
                await axios.post('/api/config', { key: currentKey, value: currentValue });
            }
            alert("Config saved");
            setDialogOpen(false);
            fetchConfigData();
        } catch (error) {
            console.error("Error saving configuration:", error);
            alert("Failed to save configuration. Please check your inputs.");
        }
    };

    const handleEdit = (key: string, value: string) => {
        setCurrentKey(key);
        setCurrentValue(value);
        setIsEditMode(true);
        setDialogOpen(true);
    };

    const handleAddNew = () => {
        setCurrentKey('');
        setCurrentValue('');
        setIsEditMode(false);
        setDialogOpen(true);
    };

    useEffect(() => {
        fetchConfigData();
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <Typography variant="h4" gutterBottom>Configuration Manager</Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddNew}
                        style={{ marginBottom: '1rem' }}
                    >
                        Add New Configuration
                    </Button>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Key</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                                <TableCell><strong>Value</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {configData.map(({ key, value }) => (
                                <TableRow key={key}>
                                    <TableCell>{key}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleEdit(key, value)}>Edit</Button>
                                    </TableCell>
                                    <TableCell>{value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </>
            )}

            <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>{isEditMode ? 'Edit Configuration' : 'Add New Configuration'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Key"
                        value={currentKey}
                        onChange={(e) => setCurrentKey(e.target.value)}
                        fullWidth
                        disabled={isEditMode} // Disable key editing in edit mode
                        margin="normal"
                    />
                    <TextField
                        label="Value"
                        value={currentValue}
                        onChange={(e) => setCurrentValue(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ConfigManager;
