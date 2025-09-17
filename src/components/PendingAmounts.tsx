import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  TextareaAutosize,
  Stack,
  CircularProgress,
} from "@mui/material";

const PendingAmounts: React.FC = () => {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Set default dates when the component loads
    const today = new Date();
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 30);

    // Set the date format as yyyy-mm-dd
    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    setFromDate(formatDate(pastDate));
    setToDate(formatDate(today));
  }, []);

  const handleSubmit = async () => {
    setError(null); // Clear any previous errors
    setLoading(true); // Start loading
    try {
      const response = await axios.get<string>("/api/DayReport/PendingAmounts", {
        params: { fromDate, toDate },
      });
      setResult(response.data); // Set the response data into the result state
    } catch (err) {
      setError("Error fetching data. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(result)
      .then(() => {
        alert("Text copied to clipboard!");
      })
      .catch((err) => {
        alert("Failed to copy text: " + err);
      });
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Pending Amount Report for WhatsApp Post
      </Typography>

      <Stack spacing={2} direction="row" mb={3} alignItems="center">
        <TextField
          label="From Date"
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="To Date"
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading} // Disable the button while loading
          startIcon={loading && <CircularProgress size={20} />} // Add spinner
        >
          {loading ? "Loading..." : "Submit"}
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h6" gutterBottom>
        Report Result
      </Typography>

      <TextareaAutosize
        value={result}
        onChange={(e) => setResult(e.target.value)}
        minRows={10}
        style={{
          width: "50%",
          padding: "10px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />

      <Box mt={2}>
        <Button variant="contained" color="secondary" onClick={handleCopy}>
          Copy
        </Button>
      </Box>
    </Box>
  );
};

export default PendingAmounts;
