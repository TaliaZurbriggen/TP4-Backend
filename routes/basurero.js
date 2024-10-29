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
      const { fecha, distancia_promedio } = basurero;

      // Verifica los datos recibidos con interpolación correcta
      console.log(`Fecha: ${fecha}, Distancia Promedio: ${distancia_promedio}`);

      // Convertir distancia_promedio a número (de string a float)
      const distanciaPromedioNumerica = parseFloat(distancia_promedio);

      const basureroExistente = await Basurero.findOne({ where: { fecha } });

      if (!basureroExistente) {
        // Validar que distanciaPromedioNumerica es un número válido
        if (!isNaN(distanciaPromedioNumerica)) {
          try {
            await Basurero.create({ fecha, distancia_promedio: distanciaPromedioNumerica });
            console.log(`Registro insertado: Fecha: ${fecha}, Distancia Promedio: ${distanciaPromedioNumerica}`);
          } catch (insertError) {
            console.error('Error al insertar en la base de datos:', insertError);
          }
        } else {
          console.error(`Distancia promedio no válida para la fecha ${fecha}: ${distancia_promedio}`);
        }
      }
    }

    res.status(200).json({ message: 'Datos insertados/actualizados correctamente' });
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'Error al obtener datos o guardar en la base de datos' });
  }
});

module.exports = router;


