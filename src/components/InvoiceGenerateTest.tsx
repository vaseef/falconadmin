import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Modal, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import axios from 'axios';

interface TableData {
  id: string;
  slotdate: string;
  slottime: string;
  slothours: number;
  slotamount: number;
  bookingcode: string;
}

const InvoiceGenerateTest: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);

  const fetchTableData = async () => {
    if (!searchText.trim()) {
      alert('Please enter a search query before clicking the search button.');
      return;
    }
  
    setIsLoadingSearch(true);
    try {
      const response = await axios.get<TableData[]>(`/api/InvoiceGenerateTest/search?query=${searchText}`);
      setTableData(response.data);
    } catch (error) {
      console.error('Error fetching table data', error);
    } finally {
      setIsLoadingSearch(false);
    }
  };
  

  const generatePDF = async () => {
    if (selectionModel.length === 0) {
      alert('Please select at least one row to generate the PDF.');
      return;
    }

    setIsLoadingPDF(true);
    try {
      const selectedRecords = tableData.filter((row) => selectionModel.includes(row.id));
      const bookingIds = selectedRecords.map((record) => record.bookingcode).join(',');
      const response = await axios.post(
        '/api/InvoiceGenerateTest/generatepdf',
        { records: bookingIds, mobilenumber: searchText },
        { responseType: 'blob' } // Expect a blob response for the PDF
      );

      const pdfBlob = new Blob([response.data as BlobPart], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'Invoice.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsLoadingPDF(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (pdfUrl) URL.revokeObjectURL(pdfUrl); // Clean up the object URL
    setPdfUrl(null);
  };

  const columns: GridColDef[] = [
    { field: 'slotdate', headerName: 'Date', width: 150 },
    { field: 'slottime', headerName: 'Time', width: 150 },
    { field: 'slothours', headerName: 'Hours', width: 100 },
    { field: 'slotamount', headerName: 'Amount', width: 150 },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Generate Invoice
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <TextField
          label="Mobile Number"
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ width: '20ch' }}
        />
        <Button
          variant="contained"
          onClick={fetchTableData}
          sx={{ alignSelf: 'flex-start' }}
          disabled={isLoadingSearch}
          startIcon={isLoadingSearch ? <CircularProgress size={20} /> : null}
        >
          {isLoadingSearch ? 'Loading...' : 'Search'}
        </Button>
      </Box>
      <DataGrid
        rows={tableData}
        columns={columns}
        checkboxSelection
        onRowSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}
        autoHeight
        disableRowSelectionOnClick
      />
      <Box mt={3}>
        <Button
          variant="contained"
          onClick={generatePDF}
          disabled={isLoadingPDF}
          startIcon={isLoadingPDF ? <CircularProgress size={20} /> : null}
        >
          {isLoadingPDF ? 'Generating...' : 'Generate PDF'}
        </Button>
      </Box>

      <Modal open={isModalOpen} onClose={closeModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxHeight: '90vh',
            overflow: 'auto',
            width: '80%',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Invoice Preview
          </Typography>
          {pdfUrl && <iframe src={pdfUrl} width="100%" height="500px" title="Invoice PDF Preview" />}
        </Box>
      </Modal>
    </Box>
  );
};

export default InvoiceGenerateTest;
