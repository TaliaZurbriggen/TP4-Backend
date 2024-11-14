const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { Notificacion, Basurero, Empleado } = require('../models');
const cron = require('node-cron');  // Con esto programamos las tareas periódicas
const { Sequelize } = require('sequelize'); 
const { Op } = require('sequelize');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tobiasgasparotto@gmail.com',  
    pass: 'exdg cyle yeyj zjnu'         
  }
});


const sendNotificationEmails = async (nivelLlenadoActual, basureroId) => {
  try {
    const correos = await Empleado.findAll({ attributes: ['email', 'id'] });
    const destinatarios = correos.map(correo => correo.email).join(',');

    const mailOptions = {
      from: 'tobiasgasparotto@gmail.com',  
      to: destinatarios,
      subject: 'Notificación de Llenado',
      text: `El nivel de llenado del basurero ha alcanzado ${nivelLlenadoActual}%. Por favor, revisa el sistema.`
    };

    await transporter.sendMail(mailOptions);
    console.log('Correos enviados con éxito a:', destinatarios);

   
    for (const correo of correos) {
      await Notificacion.create({
        contenido: `Notificación de llenado: nivel alcanzado ${nivelLlenadoActual}%`,
        idMail: correo.id,
        idBasurero: basureroId  
      });
    }
  } catch (error) {
    console.error('Error al enviar correos o registrar notificación:', error);
  }
};


const verificarNivelLlenado = async () => {
  try {
    const limiteLlenado = 75;  
    const response = await fetch('https://script.google.com/macros/s/AKfycbwxFFeoO1X_CIDQ8hQ06ac_l0aLmvk5Liimh57Qgdzya93w3HaALJQ4SpeGWzE0BVT_/exec');

    if (!response.ok) {
      throw new Error(`Error al obtener datos de Google Sheets: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.length === 0) {
      console.log('No se encontraron datos en Google Sheets');
      return;
    }

    // Obtén el último registro (asumiendo que los datos están en orden cronológico)
    const ultimoRegistro = data[data.length - 1];

    const nivelLlenado = (ultimoRegistro.distancia_promedio > 40) 
      ? 100  // Basurero lleno
      : Math.min(Math.round((1 - ultimoRegistro.distancia_promedio / 40) * 100), 100);

    console.log("Nivel de llenado calculado:", nivelLlenado);

    // Si el nivel de llenado supera el límite, enviamos la notificación
    if (nivelLlenado >= limiteLlenado) {
      await sendNotificationEmails(nivelLlenado, ultimoRegistro.id);
    } else {
      console.log('No se envía notificación: nivel de llenado por debajo del límite');
      console.log('Nivel de llenado:', nivelLlenado);
      console.log('Distancia promedio:', ultimoRegistro.distancia_promedio);
    }
  } catch (error) {
    console.error('Error al verificar el nivel de llenado:', error);
  }
};


cron.schedule('*/20 * * * * *', verificarNivelLlenado);


router.get('/', async (req, res) => {
  const { fechaInicio } = req.query;

  try {
    const where = {};

    if (fechaInicio) {
      where.fecha = {
        [Op.gte]: fechaInicio 
      };
    }

    const notificaciones = await Notificacion.findAll({
      where,
      include: [
        {
          model: Empleado,
          attributes: ['email']
        }
      ],
      order: [['fecha', 'DESC']]
    });

    if (notificaciones.length === 0) {
      console.log('No se encontraron notificaciones');
    } else {
      console.log('Notificaciones encontradas:', notificaciones);
    }

    return res.status(200).json(notificaciones);
  } catch (error) {
    console.error('Error al obtener las notificaciones:', error);
    return res.status(500).json({ error: 'Error al obtener las notificaciones.' });
  }
});
module.exports = router;





