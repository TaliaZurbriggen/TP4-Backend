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
    const ultimoRegistro = await Basurero.findOne({
      order: [['fecha', 'DESC']],  
    });

    if (ultimoRegistro) {
      const nivelLlenado = Math.min(Math.round((ultimoRegistro.distancia_promedio / 32.7) * 100), 100);
;

      // Si el nivel de llenado supera el límite, enviamos la notificación
      if (nivelLlenado >= limiteLlenado) {
        await sendNotificationEmails(nivelLlenado, ultimoRegistro.id);
      }
    }
  } catch (error) {
    console.error('Error al verificar el nivel de llenado:', error);
  }
};

// Programar la verificación cada minuto
cron.schedule('* * * * *', verificarNivelLlenado);


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





