const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Replace with your model
const billing_modal = require("./model/billing_modal");

mongoose
  .connect("mongodb://127.0.0.1:27017/billing_modal")
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => {
    console.log("Connection failed:", err.message);
  });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create a new item
// Create a new billing entry
app.post("/add", (req, res) => {
  const { userName, address, number, service_charge } = req.body; // Destructure the incoming request body

  // Validation: Ensure all required fields are present
  if (!userName || !address || !number || !service_charge) {
    return res.status(400).json({
      error:
        "All fields (userName, address, number, service_charge) are required.",
    });
  }

  // Create a new billing document using the destructured fields
  billing_modal
    .create({ userName, address, number, service_charge })
    .then((result) => res.status(201).json(result))
    .catch((err) =>
      res.status(500).json({ error: "Failed to add billing entry." })
    );
});

// Retrieve all items
app.get("/get", (req, res) => {
  billing_modal
    .find()
    .then((result) => res.status(200).json(result))
    .catch((err) =>
      res.status(500).json({ error: "Failed to retrieve items." })
    );
});
// Retrieve a billing entry by ID
app.get("/get/:id", (req, res) => {
  const id = req.params.id; // Get the ID from the request parameters
  billing_modal
    .findById(id)
    .then((result) => {
      if (!result) {
        return res.status(404).json({ error: "Billing entry not found." });
      }
      res.status(200).json(result); // Return the billing entry if found
    })
    .catch((err) =>
      res.status(500).json({ error: "Failed to retrieve the billing entry." })
    );
});

// Update an item by ID
// Update an item by ID
app.put("/update/:id", (req, res) => {
  const id = req.params.id;
  const updatedData = req.body; // Accept updated data from the request body

  billing_modal
    .findByIdAndUpdate(id, updatedData, { new: true }) // Use new: true to return the updated document
    .then((updatedItem) => {
      if (!updatedItem) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.status(200).json(updatedItem); // Return the updated item
    })
    .catch((err) => res.status(500).json({ error: "Failed to update item" }));
});
// Backend route to search for clients by userName
app.get("/search", (req, res) => {
  const searchQuery = req.query.query; // Get the search term from the query string

  billing_modal
    .find({ userName: new RegExp(searchQuery, "i") }) // Case-insensitive search using regex
    .then((results) => res.status(200).json(results))
    .catch((err) =>
      res.status(500).json({ error: "Failed to perform search." })
    );
});

// Delete an item by ID
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  billing_modal
    .findByIdAndDelete(id)
    .then((deletedItem) => {
      if (!deletedItem) {
        return res.status(404).json({ error: "Item not found" });
      }
      res
        .status(200)
        .json({ message: "Item deleted successfully", deletedItem });
    })
    .catch((err) => res.status(500).json({ error: "Failed to delete item" }));
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
