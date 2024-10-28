const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { sequelize } = require('./models');

app.use(bodyParser.json());

const basureroRoutes = require('./routes/basurero');
const mailRoutes = require('./routes/mails');
const notificacionesRoutes = require('./routes/notificaciones');

app.use('/api/basurero', basureroRoutes);
app.use('/api/mails', mailRoutes);
app.use('/api/notificaciones', notificacionesRoutes);

sequelize.sync()
  .then(() => console.log('Base de datos sincronizada'))
  .catch(error => console.error('Error al sincronizar la base de datos:', error));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));