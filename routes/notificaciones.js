const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { Notificacion, Basurero, Empleado } = require('../models');

// Configura el transportador de nodemailer para Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tobiasgasparotto@gmail.com',
    pass: 'exdg cyle yeyj zjnu'
  }
});

const sendNotificationEmails = async () => {
  try {
    const correos = await Empleado.findAll({ attributes: ['email'] });
    const destinatarios = correos.map(correo => correo.email).join(',');

    const mailOptions = {
      from: 'tobiasgasparotto@gmail.com',
      to: destinatarios,
      subject: 'Notificación de Llenado',
      text: 'El nivel de llenado ha superado el umbral especificado. Por favor, revisa el sistema para más detalles.'
    };

    await transporter.sendMail(mailOptions);
    console.log('Correos enviados con éxito a:', destinatarios);
  } catch (error) {
    console.error('Error al enviar correos:', error);
  }
};

// Ruta para enviar notificación si el llenado supera el umbral
router.post('/', async (req, res) => {
  const { umbral } = req.body;

  try {
    // Recupera el nivel de llenado actual del basurero
    const basurero = await Basurero.findOne({ where: { id: 1 } }); // Ajusta según la lógica de tu base de datos
    const nivelLlenadoActual = basurero.distancia_promedio;

    // Verifica si el nivel de llenado actual supera el umbral
    if (nivelLlenadoActual >= umbral) {
      await sendNotificationEmails();
      res.status(201).json({ message: 'Notificación enviada a los correos registrados.' });
    } else {
      res.status(200).json({ message: 'El nivel de llenado no es suficiente para enviar notificación.' });
    }
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    res.status(500).json({ error: 'Error al enviar notificación' });
  }
});

module.exports = router;
