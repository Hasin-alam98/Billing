import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Create from "./Create";
import Client_list from "./Client_list";
import SearchResults from "./SearchResults";
import Info from "./Info";
import Edit from "./Edit";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Container,
  TextField,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState(""); // State to store the search term
  const navigate = useNavigate(); // To navigate to the search results page

  // Handler for when the user types in the search field
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handler for when the search button is clicked
  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?query=${searchTerm}`); // Navigate to the search results page
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Billing App
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/list">
            Client List
          </Button>
          {/* Search Field */}
          <TextField
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search clients..."
            variant="outlined"
            size="small"
            sx={{
              bgcolor: "white",
              borderRadius: 1,
              marginLeft: 2,
              width: "200px",
            }}
          />
          <IconButton
            color="inherit"
            onClick={handleSearch} // Trigger the search when clicked
            sx={{ ml: 1 }}
          >
            <SearchIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          {/* Set Create as the default page */}
          <Route path="/" element={<Create />} />
          <Route path="/list" element={<Client_list />} />
          {/* Include the dynamic ID in the routes */}
          <Route path="/info/:id" element={<Info />} />
          <Route path="/update/:id" element={<Edit />} />
          <Route path="/search" element={<SearchResults />} />
          {/* Optionally, you can add a search results page */}
          {/* <Route path="/search" element={<SearchResults />} /> */}
        </Routes>
      </Container>
    </>
  );
};

export default Home;
