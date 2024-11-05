const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Mantén solo esta declaración

const { sequelize } = require('./models');

const app = express();

// Configura CORS
app.use(cors({
    origin: 'http://localhost:3000', // Cambia esto según la URL de tu frontend
    methods: ['GET', 'POST', 'DELETE'],
}));

app.use(bodyParser.json());

const mailRoutes = require('./routes/mails');
app.use('/api/mails', mailRoutes);

app.get('/', (req, res) => {
  res.send('Bienvenido a la API de gestión de correos.');
});

sequelize.sync({ force: false }) // Cambia a `false` en producción
  .then(() => {
    console.log('Base de datos sincronizada con estructura actualizada');
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
  })
  .catch(error => console.error('Error al sincronizar la base de datos:', error));






