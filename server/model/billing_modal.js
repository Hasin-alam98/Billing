const mongoose = require("mongoose");

const billing_schema = new mongoose.Schema({
  userName: { type: String, required: true },
  address: { type: String, required: true },
  number: { type: String, required: true },
  service_charge: { type: Number, required: true },
});

const billing_model = mongoose.model("Billing", billing_schema);

module.exports = billing_model;
