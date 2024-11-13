const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const { Basurero } = require('../models');

  const fetchDataAndUpdateDB = async () => {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxyyE0bS500MPkZhtPFLus_mA_6la2ddGoJplPuzi7hXEIq7s2TX_qV76X2p9wD3XSk/exec');
        const data = await response.json();

        for (let basurero of data) {
            const fecha = new Date(basurero.fecha);
            const distanciaPromedio = parseFloat(basurero.distancia_promedio);

            // Verifica si ya existe un registro con esta fecha y hora exactas
            const existingRecord = await Basurero.findOne({ where: { fecha } });

            if (!existingRecord) {
                // Si no existe un registro con esta fecha y hora, crea el nuevo registro
                await Basurero.create({
                    fecha: fecha,
                    distancia_promedio: distanciaPromedio
                });
            }
            // Si el registro ya existe, lo omitimos y pasamos al siguiente
        }

        console.log("Base de datos actualizada correctamente con registros únicos de fecha y hora.");
    } catch (error) {
        console.error('Error al obtener datos o actualizar la base de datos:', error);
    }
};




cron.schedule('* * * * *', fetchDataAndUpdateDB);


router.get('/datos-sheet', async (req, res) => {
  try {
    await fetchDataAndUpdateDB();
    const allRecords = await Basurero.findAll();
    res.status(200).json(allRecords); 
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'Error al obtener datos o guardar en la base de datos' });
  }
});

module.exports = router;

