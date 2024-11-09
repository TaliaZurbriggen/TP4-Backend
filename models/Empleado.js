
module.exports = (sequelize, DataTypes) => {
  const Empleado = sequelize.define('Empleado', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'empleado',
    timestamps: false,
  });

  Empleado.associate = function(models) {
    Empleado.hasMany(models.Notificacion, { foreignKey: 'idMail' });
  };

  return Empleado;
};
