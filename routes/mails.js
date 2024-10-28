const express = require('express');
const router = express.Router();
const { Empleado } = require('../models');

router.get('/', async (req, res) => {
  const mails = await Empleado.findAll();
  res.json(mails);
});

router.post('/', async (req, res) => {
  const { email } = req.body;
  const nuevoMail = await Empleado.create({ email });
  res.status(201).json(nuevoMail);
});

module.exports = router;
