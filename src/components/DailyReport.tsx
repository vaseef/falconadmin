import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Stack,
} from "@mui/material";

interface SportNetData {
  sportName: string;
  netSum: number;
  dateValue: string;
}

interface ResponseSummary {
  netSums: SportNetData[];
  dailyTarget: number;
  daySum: number;
  dayprofit: number;
}

const DailyReport = () => {
  const [data, setData] = useState<ResponseSummary>({
    netSums: [],
    dailyTarget: 0,
    daySum: 0,
    dayprofit: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<ResponseSummary>("/api/dailyreport");
      setData(data); // Store the response data into state
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(); // Call fetchReports when the component mounts
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Actual by Sport
      </Typography>

      {loading && <CircularProgress />}

      {error && (
        <Typography color="error" variant="body1" gutterBottom>
          {error}
        </Typography>
      )}

      {/* Table */}
      {!loading && !error && (
        <TableContainer component={Paper} sx={{ marginTop: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="h6">Sport Name</Typography></TableCell>
                <TableCell><Typography variant="h6">Net Sum</Typography></TableCell>
                <TableCell><Typography variant="h6">Date</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.netSums.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.sportName}</TableCell>
                  <TableCell>{item.netSum}</TableCell>
                  <TableCell>{item.dateValue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

<Stack spacing={2} sx={{ marginTop: 3 }}>
            <Box>
              <Typography variant="h6">Daily Target: {data.dailyTarget}</Typography>
            </Box>
            <Box>
              <Typography variant="h6">Day Sum: {data.daySum}</Typography>
            </Box>
            <Box>
              <Typography variant="h6">Day Profit: {data.dayprofit}</Typography>
            </Box>
          </Stack>
    </Box>
  );
};

export default DailyReport;
