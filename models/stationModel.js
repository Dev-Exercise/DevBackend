const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const stationSchema = new Schema({
  FID: {
    type: Number,
  },
  ID: {
    type: Number,
  },
  Nimi: {
    type: String,
  },
  Namn: {
    type: String,
  },
  Name: {
    type: String,
  },
  Osoite: {
    type: String,
  },
  Adress: {
    type: String,
  },
  Kaupunki: {
    type: String,
  },
  Stad: {
    type: String,
  },
  Operaattor: {
    type: String,
  },
  Kapasiteet: {
    type: Number,
  },
  x: {
    type: Number,
  },
  y: {
    type: Number,
  },
});

const Station = model("station", stationSchema);

module.exports = Station;

/*
  FID: '1',
  ID: '501',
  Nimi: 'Hanasaari',
  Namn: 'Hanaholmen',
  Name: 'Hanasaari',
  Osoite: 'Hanasaarenranta 1',
  Adress: 'Hanaholmsstranden 1',
  Kaupunki: 'Espoo',
  Stad: 'Esbo',
  Operaattor: 'CityBike Finland',
  Kapasiteet: '10',
  x: '24.840319',
  y: '60.16582'
*/
