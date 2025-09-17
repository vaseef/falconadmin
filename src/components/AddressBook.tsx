import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Stack,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";

interface Address {
  mobileNumber: string;
  name: string;
  address: string;
}

const AddressBook: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [formValues, setFormValues] = useState({ mobileNumber: "", name: "", address: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true); // Start loader
    try {
      const response = await axios.get<Address[]>("/api/address");
      setAddresses(response.data);
    } catch (err) {
      setError("Failed to load addresses.");
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const handleAddClick = () => {
    setFormValues({ mobileNumber: "", name: "", address: "" });
    setSelectedAddress(null);
    setOpen(true);
  };

  const handleEditClick = (address: Address) => {
    setFormValues(address);
    setSelectedAddress(address);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!formValues.mobileNumber || !formValues.address) {
      setError("Mobile number and address are required.");
      return;
    }

    setLoading(true); // Start loader
    try {
      if (selectedAddress) {
        // Update existing
        await axios.put(`/api/address/${formValues.mobileNumber}`, formValues);
      } else {
        // Add new
        await axios.post("/api/address", formValues);
      }
      fetchAddresses();
      handleClose();
    } catch (err: any) {
      setError("Failed to save address. " + err.response.data);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <div>
      <h1>Address List</h1>
      <Button variant="contained" color="primary" onClick={handleAddClick}>
        Add Address
      </Button>
      {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <CircularProgress />
                </Box>
            ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mobile Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {addresses.map((address, index) => (
              <TableRow key={index}>
                <TableCell>{address.mobileNumber}</TableCell>
                <TableCell>{address.name}</TableCell>
                <TableCell>{address.address}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleEditClick(address)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedAddress ? "Edit Address" : "Add Address"}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          <Stack spacing={2} mt={2}>
            <TextField
              label="Mobile Number"
              value={formValues.mobileNumber}
              onChange={(e) => setFormValues({ ...formValues, mobileNumber: e.target.value })}
              fullWidth
              disabled={!!selectedAddress}
            />
            <TextField
              label="Name"
              value={formValues.name}
              onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Address"
              value={formValues.address}
              onChange={(e) => setFormValues({ ...formValues, address: e.target.value })}
              multiline
              rows={4}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddressBook;
