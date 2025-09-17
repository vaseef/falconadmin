import React, { useState } from "react";
import axios from "axios";
import {
  Typography,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Button,
} from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { SelectChangeEvent } from "@mui/material";

interface MonthlySummary {
    footballSum: number;
    badmintonSum: number;
    totalSum: number;
    dayTarget: number;
    profit: number;
}

const MonthlyReport: React.FC = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(
    currentDate.getMonth() + 1 // Month is 0-indexed, so +1
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    currentDate.getFullYear()
  );
  const [data, setData] = useState<MonthlySummary>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const years = [2024, 2025];

  const handleMonthChange = (event: SelectChangeEvent<string>) => {
    setSelectedMonth(Number(event.target.value));
  };

  const handleYearChange = (event: SelectChangeEvent<string>) => {
    setSelectedYear(Number(event.target.value));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<MonthlySummary>(
        `/api/dailyreport/monthlyreport?month=${selectedMonth}&year=${selectedYear}`
      );
      
      setData(response.data);
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box style={{ margin: "0", maxWidth: "80%" }}>
      <Typography variant="h5" style={{ paddingBottom: "1rem" }}>
        Monthly Income Report
      </Typography>
      <Box
        display="flex"
        justifyContent="flex-start"
        gap="1rem"
        marginBottom="1rem"
      >
        <FormControl style={{ minWidth: 120 }}>
          <InputLabel>Month</InputLabel>
          <Select
            value={selectedMonth.toString()} // Convert value to string to match Select's expectations
            onChange={handleMonthChange}
            label="Month"
          >
            {months.map((month, index) => (
              <MenuItem key={index} value={(index + 1).toString()}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl style={{ minWidth: 120 }}>
          <InputLabel>Year</InputLabel>
          <Select
            value={selectedYear.toString()} // Convert value to string to match Select's expectations
            onChange={handleYearChange}
            label="Year"
          >
            {years.map((year) => (
              <MenuItem key={year} value={year.toString()}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{ alignSelf: "center" }}
        >
          Submit
        </Button>
      </Box>
      {loading ? (
        <CircularProgress style={{ display: "block", margin: "2rem auto" }} />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <div>
            {/*<table style={{ border: '3'}}>
                <tr>
                    <td>Football Collection:</td>
                    <td>{data?.footballSum}</td>
                </tr>
                <tr>
                    <td>Badminton Collection:</td>
                    <td>{data?.badmintonSum}</td>
                </tr>
                <tr>
                    <td>Total Collection:</td>
                    <td>{data?.totalSum}</td>
                </tr>
                <tr>
                    <td>Monthly Target:</td>
                    <td>{data?.dayTarget}</td>
                </tr>
                <tr>
                    <td>Monthly Profit:</td>
                    <td>{data?.profit}</td>
                </tr>
            </table> */}
            <TableContainer component={Paper} style={{ width: 360 }}>
              <Table sx={{ maxWidth: 350 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">Amount (QAR)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow
                      key={"Football"}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                      Football Collection
                      </TableCell>
                      <TableCell align="right">{data?.footballSum}</TableCell>
                    </TableRow>
                    <TableRow
                      key={"Badminton"}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                      Badminton Collection
                      </TableCell>
                      <TableCell align="right">{data?.badmintonSum}</TableCell>
                    </TableRow>
                    <TableRow
                      key={"Total"}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                      Total Collection
                      </TableCell>
                      <TableCell align="right">{data?.totalSum}</TableCell>
                    </TableRow>
                    <TableRow
                      key={"DAY"}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                      Monthly Target
                      </TableCell>
                      <TableCell align="right">{data?.dayTarget}</TableCell>
                    </TableRow>
                    <TableRow
                      key={"prodfit"}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                      Monthly Profit
                      </TableCell>
                      <TableCell align="right">{data?.profit}</TableCell>
                    </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
        </div>
       
      )}
    </Box>
  );
};

export default MonthlyReport;
