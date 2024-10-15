import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Grid,
} from "@mui/material";

const Info = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [clientInfo, setClientInfo] = useState(null); // State to store the client info
  const [loading, setLoading] = useState(true); // State to manage loading status

  useEffect(() => {
    axios
      .get(`http://localhost:3000/get/${id}`) // Fetch client info by ID
      .then((response) => {
        setClientInfo(response.data);
        setLoading(false); // Stop loading once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching client info:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    ); // Loading state
  }

  if (!clientInfo) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h5" align="center">
          No client found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Client Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Name:</Typography>
            <Typography variant="body1">{clientInfo.userName}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Address:</Typography>
            <Typography variant="body1">{clientInfo.address}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Phone:</Typography>
            <Typography variant="body1">{clientInfo.number}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Service Charge:</Typography>
            <Typography variant="body1">
              {clientInfo.service_charge} Taka
            </Typography>
          </Grid>
        </Grid>
        <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="secondary" // Make the "Edit" button stand out
            component={Link}
            to={`/update/${id}`}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="primary" // Differentiate "Back" with an outlined button
            component={Link}
            to={`/list`}
          >
            Back to Client List
          </Button>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Info;
