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
        model: 'Empleado', 
        key: 'id' 
      }
    },
    idBasurero: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Basurero', 
        key: 'id' 
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

  