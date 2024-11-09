const express = require('express');
const router = express.Router();
const { Empleado } = require('../models');


router.get('/', async (req, res) => {
  try {
    const correos = await Empleado.findAll();
    res.status(200).json(correos);
  } catch (error) {
    console.error('Error al obtener correos:', error);
    res.status(500).json({ error: 'Error al obtener correos' });
  }
});


router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string' || email.trim() === '') {
      return res.status(400).json({ error: 'El email es requerido.' });
    }

    const nuevoEmpleado = await Empleado.create({ email });
    res.status(201).json(nuevoEmpleado);
  } catch (error) {
    console.error('Error al agregar correo:', error);
    res.status(500).json({ error: 'Error al agregar correo' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const correo = await Empleado.findByPk(id);

    if (!correo) {
      return res.status(404).json({ error: 'Correo no encontrado' });
    }

    await correo.destroy();
    res.status(200).json({ message: 'Correo eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar correo:', error);
    res.status(500).json({ error: 'Error al eliminar correo' });
  }
});

module.exports = router;




