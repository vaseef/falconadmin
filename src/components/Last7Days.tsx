import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Alert } from '@mui/material';

interface DailyIncomeSummary {
  slotDate: string; // Use `string` to handle dates from API as ISO strings
  footballSum: number;
  badmintonSum: number;
  totalSum: number;
  dayTarget: number;
  profit: number;
}

const Last7Days: React.FC = () => {
  const [data, setData] = useState<DailyIncomeSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<DailyIncomeSummary[]>('/api/dailyreport/last7days');
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <CircularProgress style={{ display: 'block', margin: '2rem auto' }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <TableContainer component={Paper} style={{ margin: '0', maxWidth: '80%' }}>
      <Typography variant="h5" style={{ padding: '1rem' }}>Daily Income Summary</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Date</strong></TableCell>
            <TableCell align="right"><strong>Football Income</strong></TableCell>
            <TableCell align="right"><strong>Badminton Income</strong></TableCell>
            <TableCell align="right"><strong>Total Income</strong></TableCell>
            <TableCell align="right"><strong>Day Target</strong></TableCell>
            <TableCell align="right"><strong>Profit</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {/* <TableCell>{new Date(row.slotDate).toLocaleDateString()}</TableCell> */}
              <TableCell>{new Date(row.slotDate).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            weekday: 'long',
                          }).replace(',', '')}</TableCell>
              <TableCell align="right">{row.footballSum.toFixed(2)}</TableCell>
              <TableCell align="right">{row.badmintonSum.toFixed(2)}</TableCell>
              <TableCell align="right">{row.totalSum.toFixed(2)}</TableCell>
              <TableCell align="right">{row.dayTarget.toFixed(2)}</TableCell>
              <TableCell align="right" style={{ color: row.profit >= 0 ? 'green' : 'red' }}>
                {row.profit.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Last7Days;
