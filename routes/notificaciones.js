const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { Notificacion, Basurero, Empleado } = require('../models');
const cron = require('node-cron');  // Para programar tareas periódicas

// Configura el transportador de nodemailer para Gmail (reemplaza con tus datos)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tobiasgasparotto@gmail.com',  // Tu correo
    pass: 'exdg cyle yeyj zjnu'         // Tu contraseña de la cuenta de Gmail
  }
});

// Función para enviar correos y registrar la notificación en la base de datos
const sendNotificationEmails = async (nivelLlenadoActual, basureroId) => {
  try {
    const correos = await Empleado.findAll({ attributes: ['email', 'id'] });
    const destinatarios = correos.map(correo => correo.email).join(',');

    const mailOptions = {
      from: 'tobiasgasparotto@gmail.com',  // Correo de origen
      to: destinatarios,
      subject: 'Notificación de Llenado',
      text: `El nivel de llenado del basurero ha alcanzado ${nivelLlenadoActual}%. Por favor, revisa el sistema.`
    };

    // Enviar correos a los empleados
    await transporter.sendMail(mailOptions);
    console.log('Correos enviados con éxito a:', destinatarios);

    // Registrar cada notificación en la base de datos
    for (const correo of correos) {
      await Notificacion.create({
        contenido: `Notificación de llenado: nivel alcanzado ${nivelLlenadoActual}%`,
        idMail: correo.id,
        idBasurero: basureroId  // Usar el ID del basurero desde la función
      });
    }
  } catch (error) {
    console.error('Error al enviar correos o registrar notificación:', error);
  }
};

// Función para verificar el nivel de llenado
const verificarNivelLlenado = async () => {
  try {
    const limiteLlenado = 50;  // Define aquí el límite de llenado que prefieras (en porcentaje)
    const ultimoRegistro = await Basurero.findOne({
      order: [['fecha', 'DESC']],  // Obtener el último registro
    });

    if (ultimoRegistro) {
      // Convertir distancia promedio a porcentaje de llenado
      const nivelLlenado = Math.min(Math.round((ultimoRegistro.distancia_promedio / 200) * 100), 100);

      // Si el nivel de llenado supera el límite, enviamos la notificación
      if (nivelLlenado >= limiteLlenado) {
        await sendNotificationEmails(nivelLlenado, ultimoRegistro.id);
      }
    }
  } catch (error) {
    console.error('Error al verificar el nivel de llenado:', error);
  }
};

// Programamos la tarea para ejecutarse cada minuto (ajusta la frecuencia si es necesario)
cron.schedule('* * * * *', verificarNivelLlenado);

// Ruta para obtener todas las notificaciones (esto es para depuración o verificación manual)
router.get('/', async (req, res) => {
  try {
    const notificaciones = await Notificacion.findAll();
    return res.status(200).json(notificaciones);
  } catch (error) {
    console.error('Error al obtener las notificaciones:', error);
    return res.status(500).json({ error: 'Error al obtener las notificaciones.' });
  }
});

module.exports = router;



