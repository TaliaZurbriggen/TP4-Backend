const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const express = require('express');
const router = express.Router();
const { Basurero } = require('../models');

router.get('/datos-sheet', async (req, res) => {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbyTdMBSUv8lFQEf2sNnLDbHXVITURXDOex3FxXIg3C9vXkGdgWX1cUFHjDkr5tCbqrrmg/exec');
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

    res.status(200).json({ message: 'Datos insertados/actualizados correctamente' });
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'Error al obtener datos o guardar en la base de datos' });
  }
});
s


module.exports = router;

