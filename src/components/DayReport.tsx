import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Alert,
  } from "@mui/material";
  //import { format } from "date-fns";

export interface BookingData {
    timestamp: Date;
    slotDate: Date;
    time: string;
    bookingId: string;
    place: string;
    sportName: string;
    court: string;
    type: string;
    gross: number;
    discount: number;
    net: number;
    paid: number;
    userName: string;
    userMobile: string;
    userEmail: string;
    handler: string;
}

export interface DailyIncomeSummary {
    slotDate: Date;
    footballSum: number;
    badmintonSum: number;
    totalSum: number;
    dayTarget: number;
    profit: number;
}

export interface DayDetail {
    dailyIncomeSummary: DailyIncomeSummary;
    bookingDatas: BookingData[];
}

const DayReport: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [dailyIncomeSummary, setDailyIncomeSummary] = useState<DailyIncomeSummary | null>(null);
    const [bookingDatas, setBookingDatas] = useState<BookingData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false); // New state for loading

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setSelectedDate(today);
    }, []);

    const handleSubmit = async () => {
        setError(null);
        setIsLoading(true); // Start loading
        try {
            const response = await axios.get<DayDetail>("/api/DayReport/DayReport", {
                params: { date: selectedDate },
            });

            if (response.data && response.data.bookingDatas) {
                setBookingDatas(response.data.bookingDatas);
                setDailyIncomeSummary(response.data.dailyIncomeSummary);
            } else {
                setBookingDatas([]);
                setError("No data fetched");
            }
        } catch (err) {
            console.error("API Error:", err);
            setError("Error fetching data. Please try again.");
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    const shareToWhatsApp = () => {
        if (dailyIncomeSummary) {
            const { slotDate, footballSum, badmintonSum, totalSum, dayTarget, profit } = dailyIncomeSummary;
            const message = `
                Daily Income Summary:
                Slot Date: ${format(slotDate, "dd-MMM-yyyy")}
                Football Sum: ${footballSum}
                Badminton Sum: ${badmintonSum}
                Total Sum: ${totalSum || footballSum + badmintonSum}
                Day Target: ${dayTarget}
                Profit: ${profit || footballSum + badmintonSum - dayTarget}
            `;
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
            window.open(whatsappUrl, "_blank");
        }
    };

    return (
            <Box p={3}>
              <Typography variant="h4" gutterBottom>
                Day Report
              </Typography>
        
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <TextField
                  type="date"
                  label="Select Date"
                  InputLabelProps={{ shrink: true }}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} /> : "Submit"}
                </Button>
              </Box>
        
              {error && <Alert severity="error">{error}</Alert>}
        
              {isLoading && (
                <Box display="flex" justifyContent="center" my={2}>
                  <CircularProgress />
                </Box>
              )}
        
              {dailyIncomeSummary && (
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Daily Income Summary
                  </Typography>
                  <Typography><strong>Slot Date:</strong> {format(new Date(dailyIncomeSummary.slotDate), "dd-MMM-yyyy")}</Typography>
                  <Typography><strong>Football Sum:</strong> {dailyIncomeSummary.footballSum}</Typography>
                  <Typography><strong>Badminton Sum:</strong> {dailyIncomeSummary.badmintonSum}</Typography>
                  <Typography><strong>Total Sum:</strong> {dailyIncomeSummary.totalSum || dailyIncomeSummary.footballSum + dailyIncomeSummary.badmintonSum}</Typography>
                  <Typography><strong>Day Target:</strong> {dailyIncomeSummary.dayTarget}</Typography>
                  <Typography><strong>Profit:</strong> {dailyIncomeSummary.profit || (dailyIncomeSummary.footballSum + dailyIncomeSummary.badmintonSum - dailyIncomeSummary.dayTarget)}</Typography>
                  <Button variant="contained" color="success" onClick={shareToWhatsApp} sx={{ mt: 2 }}>
                    Share to WhatsApp
                  </Button>
                </Paper>
              )}
        
              {bookingDatas.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Booking Data
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#e0f7fa" }}>
                          <TableCell>Slot Date</TableCell>
                          <TableCell>Time</TableCell>
                          <TableCell>Booking ID</TableCell>
                          <TableCell>Sport Name</TableCell>
                          <TableCell>Court</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Gross</TableCell>
                          <TableCell>Discount</TableCell>
                          <TableCell>Net</TableCell>
                          <TableCell>Paid</TableCell>
                          <TableCell>User Name</TableCell>
                          <TableCell>User Mobile</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {bookingDatas.map((booking, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              backgroundColor: booking.net !== booking.paid ? "#ffcdd2" : "transparent",
                            }}
                          >
                            <TableCell>{format(new Date(booking.slotDate), "dd-MMM-yyyy")}</TableCell>
                            <TableCell>{booking.time}</TableCell>
                            <TableCell>{booking.bookingId}</TableCell>
                            <TableCell>{booking.sportName}</TableCell>
                            <TableCell>{booking.court}</TableCell>
                            <TableCell>{booking.type}</TableCell>
                            <TableCell>{booking.gross}</TableCell>
                            <TableCell>{booking.discount}</TableCell>
                            <TableCell>{booking.net}</TableCell>
                            <TableCell>{booking.paid}</TableCell>
                            <TableCell>{booking.userName}</TableCell>
                            <TableCell>{booking.userMobile}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
         
    );
};

export default DayReport;
