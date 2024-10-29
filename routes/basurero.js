const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const express = require('express');
const router = express.Router();
const { Basurero } = require('../models');

router.get('/datos-sheet', async (req, res) => {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbwGu9CxFjdYhBeB_9Cz_fawCGw9WCjSGZ0Yz--dObAKRBF-Y-j5z8_0OxXvY2houpCm1g/exec');
    const data = await response.json();

    for (let basurero of data) {
      const { estado, fechaActualizacion } = basurero;

      const basureroExistente = await Basurero.findOne({ where: { fechaActualizacion } });

      if (!basureroExistente) {
        await Basurero.create({ estado, fechaActualizacion });
      }
    }

    res.status(200).json({ message: 'Datos insertados/actualizados correctamente' });
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'Error al obtener datos o guardar en la base de datos' });
  }
});

module.exports = router;

