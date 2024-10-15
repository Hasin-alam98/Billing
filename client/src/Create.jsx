import React, { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import {
  TextField,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  Typography,
  Container,
  Paper,
} from "@mui/material";

const Create = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    userName: "",
    address: "",
    number: "",
    services: {
      websiteDesign: { selected: false, price: "" },
      domainRegistration: { selected: false, price: "" },
      hosting: { selected: false, price: "" },
      erpSoftware: { selected: false, price: "" },
      dedicatedIP: { selected: false, price: "" },
      emailConfiguration: { selected: false, price: "" },
      backupSolution: { selected: false, price: "" },
    },
  });

  const [successMessage, setSuccessMessage] = useState("");

  const convertNumberToWords = (number) => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const scales = ["", "Thousand", "Million"];

    if (number === 0) return "Zero";

    const numToWords = (num) => {
      let word = "";

      if (num < 20) {
        word = ones[num];
      } else if (num < 100) {
        word =
          tens[Math.floor(num / 10)] +
          (num % 10 !== 0 ? " " + ones[num % 10] : "");
      } else {
        word =
          ones[Math.floor(num / 100)] +
          " Hundred" +
          (num % 100 !== 0 ? " and " + numToWords(num % 100) : "");
      }

      return word;
    };

    let word = "";
    let scaleIndex = 0;

    while (number > 0) {
      const currentPart = number % 1000;
      if (currentPart !== 0) {
        const scale = scales[scaleIndex] ? " " + scales[scaleIndex] : "";
        word = numToWords(currentPart) + scale + (word ? " " + word : "");
      }
      number = Math.floor(number / 1000);
      scaleIndex++;
    }

    return word.trim();
  };

  // Example usage
  const totalServiceCharge = 123456;
  console.log(convertNumberToWords(totalServiceCharge)); // Output: "One Hundred and Twenty Three Thousand Four Hundred and Fifty Six"

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle service toggle
  const handleServiceToggle = (service) => {
    setFormData((prevData) => ({
      ...prevData,
      services: {
        ...prevData.services,
        [service]: {
          ...prevData.services[service],
          selected: !prevData.services[service].selected,
        },
      },
    }));
  };

  // Handle service price change
  const handleServicePriceChange = (service, price) => {
    setFormData((prevData) => ({
      ...prevData,
      services: {
        ...prevData.services,
        [service]: {
          ...prevData.services[service],
          price: price,
        },
      },
    }));
  };

  // Generate PDF function
  const generatePDF = (services, totalServiceCharge) => {
    const doc = new jsPDF();

    // Set up page width for centering text
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add "JBCSS" (as bold purple text, centered)
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(128, 0, 128); // Purple color
    const text1 = "JBCSS";
    const text1Width = doc.getTextWidth(text1);
    doc.text(text1, (pageWidth - text1Width) / 2, 20); // Centered horizontally

    // Add the company slogan (centered)
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    const slogan1 = "The destination for complete IT solution";
    const slogan1Width = doc.getTextWidth(slogan1);
    doc.text(slogan1, (pageWidth - slogan1Width) / 2, 30);

    // Add services tagline (centered)
    doc.setFontSize(10);
    doc.setTextColor(128, 0, 128); // Purple text for the line
    const tagline =
        "Software Development | Web Page Design | ERP Solution | Networking | Desktop IT Support";
    const taglineWidth = doc.getTextWidth(tagline);
    doc.text(tagline, (pageWidth - taglineWidth) / 2, 40);

    // Horizontal line after the slogan
    doc.setDrawColor(128, 0, 128); // Purple line
    doc.line(20, 50, 190, 50); // Horizontal line

    // Set Text Color for Next Elements
    doc.setTextColor(0, 0, 0);

    // Adjusted Y-coordinates for spacing
    const startY = 60; // Starting position for client information
    const lineSpacing = 10; // Space between lines

    doc.text("Client Name: " + formData.userName, 20, startY);
    doc.text("Address: " + formData.address, 20, startY + lineSpacing);
    doc.text("Phone: " + formData.number, 20, startY + lineSpacing * 2);

    // Add Subject
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    const subject = "Subject: Service Bill";
    doc.text(subject, 20, startY + lineSpacing * 3); // Adjust Y position based on previous lines

    // Add Greeting
    doc.setFont("helvetica", "normal");
    doc.text("Dear Sir,", 20, startY + lineSpacing * 4); // Adjust Y position based on previous lines
    doc.text("Assalamu-alikum.", 20, startY + lineSpacing * 5); // Adjust Y position based on previous lines
    doc.text("Please see the below service charges details.", 20, startY + lineSpacing * 6); // Adjust Y position based on previous lines

    // Horizontal line before the table
    doc.line(20, startY + lineSpacing * 7, 190, startY + lineSpacing * 7);

    // Services Table Header (using jspdf-autotable)
    const tableColumn = ["S/N", "Service Name", "Price (Taka)"];
    const tableRows = [];

    // Populate table rows from services data, excluding "Software Technical Support"
    let index = 1; // Start the index from 1
    Object.entries(services).forEach(([service, { selected, price }]) => {
        if (selected && service !== "Software Technical Support") {
            tableRows.push([index, service, price + " Taka"]); // Add S/N to the row
            index++; // Increment the index for the next row
        }
    });

    // Add Total Price row to the table as a two-column entry
    tableRows.push(["", "Total", totalServiceCharge + " Taka"]); // S/N left empty for total

    // Set the desired table width (adjust this value as needed)
    const tableWidth = pageWidth - 40; // For example, 40 units margin (20 on each side)

    // Add table to PDF
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: startY + lineSpacing * 8, // Table position after greeting
        theme: "grid", // Optional: to give a grid look
        styles: {
            halign: "left", // Align content to the left
            fontSize: 10,
        },
        headStyles: {
            fillColor: [128, 0, 128], // Purple header
            textColor: [255, 255, 255], // White text
        },
        margin: { top: 10, bottom: 10, left: 20, right: 20 }, // Set margins for the table
        tableWidth: tableWidth, // Set the table width
    });

    // Get final Y position after the table
    const finalY = doc.lastAutoTable.finalY || startY + lineSpacing * 8;

    // Convert total amount to words
    const totalInWords = convertNumberToWords(totalServiceCharge);

    // Display Total in Words (bold)
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total in words: " + totalInWords + " taka only", 20, finalY + 20);

    // Add Sign Off
    doc.setFont("helvetica", "normal");
    doc.text("Many Thanks and Best Regards,", 20, finalY + 40);
    doc.text("Hasin Bin Alam", 20, finalY + 50);
    doc.text("Cell: +8801859596152", 20, finalY + 60);

    // Add Footer with address
    doc.setDrawColor(128, 0, 128);
    doc.line(20, finalY + 70, 190, finalY + 70); // Horizontal line before footer address

    doc.setFontSize(10);
    doc.text(
        "1060, Zakir Hossain Road, Khulshi, Ctg | Apt 3B/Road No 4, D-Bik, Banshree, Dhaka | jbcss.bd@gmail.com",
        20,
        finalY + 80
    );
    // doc.text("jbcss.bd@gmail.com", 20, finalY + 90);

    // Save the PDF
    doc.save("JBCSS.pdf"); // Save the PDF
};



  // Calculate total service charge
  const calculateTotal = () => {
    return Object.entries(formData.services).reduce(
      (total, [service, { selected, price }]) => {
        if (selected && price) {
          return total + parseFloat(price);
        }
        return total;
      },
      0
    );
  };

  // Handle form submission
  const handleCreate = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const totalServiceCharge = calculateTotal();

    // Prepare data to send to backend
    const dataToSend = {
      userName: formData.userName,
      address: formData.address,
      number: formData.number,
      service_charge: totalServiceCharge,
    };

    // Send POST request to create billing entry
    axios
      .post("http://localhost:3000/add", dataToSend)
      .then((response) => {
        console.log("Billing entry created:", response.data);

        // Generate the PDF after the billing entry is created
        generatePDF(formData.services, totalServiceCharge);

        // Clear the form
        setFormData({
          userName: "",
          address: "",
          number: "",
          services: {
            websiteDesign: { selected: false, price: "" },
            domainRegistration: { selected: false, price: "" },
            hosting: { selected: false, price: "" },
            erpSoftware: { selected: false, price: "" },
            dedicatedIP: { selected: false, price: "" },
            emailConfiguration: { selected: false, price: "" },
            backupSolution: { selected: false, price: "" },
          },
        });
        setSuccessMessage("Billing entry successfully created!");

        // Clear the success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      })
      .catch((error) => {
        console.error("Error creating billing entry:", error);
      });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Create Billing Entry
        </Typography>
        <form onSubmit={handleCreate}>
          <Grid container spacing={3}>
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
                type="tel"
                value={formData.number}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Select Services</Typography>
              {Object.keys(formData.services).map((serviceKey) => (
                <Grid
                  container
                  key={serviceKey}
                  spacing={1}
                  alignItems="center"
                >
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.services[serviceKey].selected}
                          onChange={() => handleServiceToggle(serviceKey)}
                        />
                      }
                      label={serviceKey.replace(/([A-Z])/g, " $1")}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Price"
                      type="number"
                      value={formData.services[serviceKey].price}
                      onChange={(e) =>
                        handleServicePriceChange(serviceKey, e.target.value)
                      }
                      disabled={!formData.services[serviceKey].selected}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                </Grid>
              ))}
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Submit
              </Button>
            </Grid>
          </Grid>
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

export default Create;
