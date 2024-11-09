const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const express = require('express');
const router = express.Router();
const { Basurero } = require('../models');

router.get('/datos-sheet', async (req, res) => {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxyyE0bS500MPkZhtPFLus_mA_6la2ddGoJplPuzi7hXEIq7s2TX_qV76X2p9wD3XSk/exec');
    const data = await response.json();

    console.log("Datos recibidos de la API de Google:", data);

    
    for (let basurero of data) {
      const fecha = new Date(basurero.fecha);
      const distanciaPromedio = parseFloat(basurero.distancia_promedio);

      const existingRecord = await Basurero.findOne({
        where: { fecha: fecha }
      });

      if (existingRecord) {
        await existingRecord.update({ distancia_promedio: distanciaPromedio });
      } else {
        await Basurero.create({
          distancia_promedio: distanciaPromedio,
          fecha: fecha
        });
      }
    }


    const allRecords = await Basurero.findAll();
    res.status(200).json(allRecords); 
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'Error al obtener datos o guardar en la base de datos' });
  }
});



module.exports = router;
