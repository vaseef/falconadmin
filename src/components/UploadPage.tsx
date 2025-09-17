import React, { useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const UploadPage: React.FC = () => {
  // State for booking file
  const [bookingFile, setBookingFile] = useState<File | null>(null);
  const [bookingFileName, setBookingFileName] = useState<string>("");
  const [isBookingUploading, setIsBookingUploading] = useState<boolean>(false);

  // State for cancellation file
  const [cancelFile, setCancelFile] = useState<File | null>(null);
  const [cancelFileName, setCancelFileName] = useState<string>("");
  const [isCancelUploading, setIsCancelUploading] = useState<boolean>(false);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "booking" | "cancel"
  ) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    
    if (selectedFile) {
      const fileName = selectedFile.name.toLowerCase();
      // Validate file name contains "booking" or "cancel"
      if (type === "booking" && !fileName.includes("booking")) {
        alert("Please select a file that contains 'booking' in its name.");
        return;
      }
      if (type === "cancel" && !fileName.includes("cancel")) {
        alert("Please select a file that contains 'cancel' in its name.");
        return;
      }

      if (type === "booking") {
        setBookingFile(selectedFile);
        setBookingFileName(selectedFile ? selectedFile.name : "");
      } else {
        setCancelFile(selectedFile);
        setCancelFileName(selectedFile ? selectedFile.name : "");
      }
    }
  };

  const handleUpload = async (type: "booking" | "cancel") => {
    const file = type === "booking" ? bookingFile : cancelFile;
    const setIsUploading =
      type === "booking" ? setIsBookingUploading : setIsCancelUploading;

    if (!file) {
      alert(`Please select a file to upload for ${type === "booking" ? "bookings" : "cancellations"}.`);
      return;
    }

    // Set loading state to true
    setIsUploading(true);

    // Create FormData object to send file data
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Make the API request to upload the file
      await axios.post(`/api/upload/${type === "booking" ? "upload" : "uploadcancel"}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle successful response
      alert(`File uploaded successfully for ${type === "booking" ? "bookings" : "cancellations"}!`);
    } catch (error) {
      // Handle error
      console.error(`Error uploading ${type === "booking" ? "booking" : "cancellation"} file:`, error);
      alert(`Failed to upload file for ${type === "booking" ? "bookings" : "cancellations"}.`);
    } finally {
      // Set loading state to false
      setIsUploading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0" }}>
      <h2>Upload Booking and Cancellation Excel Files</h2>

      {/* Booking Upload Section */}
      <div>
        <label htmlFor="booking-file-upload" style={{ marginRight: "10px" }}>
          Upload Booking File:
        </label>
        <input
          type="file"
          id="booking-file-upload"
          accept=".xlsx, .xls"
          onChange={(event) => handleFileChange(event, "booking")}
          style={{ display: "inline-block" }}
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          value={bookingFileName}
          placeholder="No file chosen"
          readOnly
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>
      <Button
        variant="contained"
        onClick={() => handleUpload("booking")}
        disabled={isBookingUploading}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          cursor: isBookingUploading ? "not-allowed" : "pointer",
        }}
        startIcon={<CloudUploadIcon />}
      >
        {isBookingUploading ? "Uploading..." : "Upload Bookings"}
      </Button>
      {isBookingUploading && (
        <div style={{ marginTop: "20px" }}>
          <ClipLoader color="#3498db" loading={isBookingUploading} size={50} />
        </div>
      )}

      <hr style={{ margin: "40px 0" }} />

      {/* Cancellation Upload Section */}
      <div>
        <label htmlFor="cancel-file-upload" style={{ marginRight: "10px" }}>
          Upload Cancellation File:
        </label>
        <input
          type="file"
          id="cancel-file-upload"
          accept=".xlsx, .xls"
          onChange={(event) => handleFileChange(event, "cancel")}
          style={{ display: "inline-block" }}
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          value={cancelFileName}
          placeholder="No file chosen"
          readOnly
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>
      <Button
        variant="contained"
        onClick={() => handleUpload("cancel")}
        disabled={isCancelUploading}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          cursor: isCancelUploading ? "not-allowed" : "pointer",
        }}
        startIcon={<CloudUploadIcon />}
      >
        {isCancelUploading ? "Uploading..." : "Upload Cancellations"}
      </Button>
      {isCancelUploading && (
        <div style={{ marginTop: "20px" }}>
          <ClipLoader color="#e74c3c" loading={isCancelUploading} size={50} />
        </div>
      )}
    </div>
  );
};

export default UploadPage;
