const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { sequelize } = require('./models');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE'],
}));

app.use(bodyParser.json());

// Rutas
const mailRoutes = require('./routes/mails');
const basureroRoutes = require('./routes/basurero'); 
const notificacionesRoutes = require('./routes/notificaciones'); 

app.use('/api/mails', mailRoutes);
app.use('/api/basurero', basureroRoutes);
app.use('/api/notificaciones', notificacionesRoutes);

app.get('/', (req, res) => {
  res.send('Bienvenido a la API de gestión de correos.');
});

sequelize.sync({ force: false })
  .then(() => {
    console.log('Base de datos sincronizada con estructura actualizada');
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
  })
  .catch(error => console.error('Error al sincronizar la base de datos:', error));

  app.get('/api/notificaciones', async (req, res) => {
    try {
        
        const notificaciones = await Notificacion.findAll();
        res.json(notificaciones); 
    } catch (error) {
        console.error('Error al obtener las notificaciones:', error);
        res.status(500).send('Error al obtener las notificaciones');
    }
});





