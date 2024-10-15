import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
const [successMessage, setSuccessMessage] = useState("");

const Edit = () => {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate(); // For redirecting after save
  const [loading, setLoading] = useState(true); // Manage loading state
  const [formData, setFormData] = useState({
    userName: "",
    address: "",
    number: "",
  });

  useEffect(() => {
    // Fetch the existing user data by ID
    axios
      .get(`http://localhost:3000/get/${id}`)
      .then((response) => {
        setFormData({
          userName: response.data.userName,
          address: response.data.address,
          number: response.data.number,
        });
        setLoading(false);
        setSuccessMessage("Account edited successfully created!");

        // Clear the success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
        // Stop loading once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching client data:", error);
        setLoading(false);
      });
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Send the updated data to the backend
    axios
      .put(`http://localhost:3000/update/${id}`, formData)
      .then(() => {
        navigate("/list"); // Redirect to the client list after saving
      })
      .catch((error) => {
        console.error("Error updating client data:", error);
      });
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Edit Client Information
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            fullWidth
          >
            Save Changes
          </Button>
        </form>
        {successMessage && (
          <Typography
            variant="body1"
            style={{ color: "green", marginBottom: "20px" }}
          >
            {successMessage}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Edit;
