import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom"; // Hook to get query parameters
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Button,
  Box, // Import Box for layout
} from "@mui/material";

const SearchResults = () => {
  const [results, setResults] = useState([]); // State to hold search results
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for handling errors
  const location = useLocation(); // Hook to access the current location

  // Function to get query parameters from the URL
  const getQueryParams = (query) => {
    return new URLSearchParams(query).get("query");
  };

  const searchQuery = getQueryParams(location.search); // Extract the 'query' from the URL

  useEffect(() => {
    if (searchQuery) {
      // Make an API call to search for clients
      axios
        .get(`http://localhost:3000/search?query=${searchQuery}`)
        .then((response) => {
          setResults(response.data); // Set the search results
          setLoading(false); // Stop loading
        })
        .catch((err) => {
          console.error("Error fetching search results:", err);
          setError("Failed to load search results");
          setLoading(false); // Stop loading
        });
    }
  }, [searchQuery]); // Rerun the effect if the search query changes

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    ); // Show a loading spinner
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h6" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  if (results.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h6" align="center">
          No results found for "{searchQuery}"
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Search Results for "{searchQuery}"
      </Typography>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <List>
          {results.map((client) => (
            <ListItem
              key={client._id}
              component={Link}
              to={`/info/${client._id}`}
            >
              <ListItemText
                primary={client.userName}
                secondary={client.address}
              />
            </ListItem>
          ))}
        </List>
        {/* Use Box for Flexbox layout to align buttons side by side */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/list"
          >
            Back to Client List
          </Button>
          <Button
            variant="contained"
            color="error" // Set the Edit button color to red
            component={Link}
            to={`/update/${results[0]._id}`} // Link to the edit page for the first search result (adjust as needed)
          >
            Edit
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SearchResults;
