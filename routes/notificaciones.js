const express = require('express');
const router = express.Router();
const { Notificacion } = require('../models');

// Crear nueva notificación
router.post('/', async (req, res) => {
  const { contenido, idMail, idBasurero } = req.body;
  const nuevaNotificacion = await Notificacion.create({ contenido, idMail, idBasurero });
  res.status(201).json(nuevaNotificacion);
});

// Listar notificaciones
router.get('/', async (req, res) => {
  const notificaciones = await Notificacion.findAll();
  res.json(notificaciones);
});

module.exports = router;
