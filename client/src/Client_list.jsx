import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Container,
  Divider,
  CircularProgress,
  Button,
} from "@mui/material";

const Client_list = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state

  useEffect(() => {
    axios
      .get("http://localhost:3000/get")
      .then((response) => {
        setClients(response.data);
        setLoading(false); // Stop loading after data is fetched
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Paper elevation={3} style={{ padding: "1rem" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Client List
        </Typography>

        {loading ? (
          <CircularProgress style={{ display: "block", margin: "2rem auto" }} />
        ) : clients.length === 0 ? (
          <Typography variant="body1" align="center">
            No clients found.
          </Typography>
        ) : (
          <List>
            {clients.map((client, index) => (
              <div key={index}>
                <ListItem>
                  <ListItemText
                    primary={`Name: ${client.userName}`}
                    secondary={`Service Charge: ${client.service_charge} Taka`}
                  />
                  <Button
                    variant="outlined"
                    color="primary"
                    component={Link}
                    to={`/info/${client._id}`} // Use proper routing parameter
                    style={{ marginLeft: "1rem" }}
                  >
                    More Info
                  </Button>
                </ListItem>
                {index < clients.length - 1 && <Divider />} {/* Adds divider between items */}
              </div>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default Client_list;
