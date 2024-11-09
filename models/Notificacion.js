module.exports = (sequelize, DataTypes) => {
  const Notificacion = sequelize.define('Notificacion', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    contenido: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idMail: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Empleado', // Nombre de la tabla relacionada
        key: 'id' // Clave primaria de la tabla relacionada
      }
    },
    idBasurero: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Basurero', // Nombre de la tabla relacionada
        key: 'id' // Clave primaria de la tabla relacionada
      }
    }
  }, {
    tableName: 'notificacion',
    timestamps: false
  });

  Notificacion.associate = function(models) {
    Notificacion.belongsTo(models.Empleado, { foreignKey: 'idMail' });
    Notificacion.belongsTo(models.Basurero, { foreignKey: 'idBasurero' });
  };

  return Notificacion;
};

  