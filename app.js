const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Mantén solo esta declaración

const { sequelize } = require('./models');

const app = express();

// Configura CORS
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'DELETE'],
}));

app.use(bodyParser.json());

const mailRoutes = require('./routes/mails');
const basureroRoutes = require('./routes/basurero'); 
app.use('/api/mails', mailRoutes);
app.use('/api/basurero', basureroRoutes);

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






