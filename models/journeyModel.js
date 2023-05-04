const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const journeySchema = new Schema({
  Departure: {
    type: Date,
  },
  Return: {
    type: Date,
  },
  ["Departure station id"]: {
    type: Number,
    required: true,
  },
  ["Departure station name"]: {
    type: String,
  },
  ["Return station id"]: {
    type: Number,
  },
  ["Return station name"]: {
    type: String,
  },
  ["Covered distance (m)"]: {
    type: Number,
    minimum: 10,
  },
  ["Duration (sec"]: {
    type: Object,
    minimum: 10,
  },
});

const Journey = model("Journey", journeySchema);

module.exports = Journey;

/*
 Departure: '2021-06-30T23:59:46',
  Return: '2021-06-30T23:59:55',
  'Departure station id': '041',
  'Departure station name': 'Ympyrätalo',
  'Return station id': '041',
  'Return station name': 'Ympyrätalo',
  'Covered distance (m)': '0',
  'Duration (sec': { ')': '8' }
*/
