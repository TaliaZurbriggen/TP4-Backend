module.exports = (sequelize, DataTypes) => {
    const Basurero = sequelize.define('Basurero', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      estado: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      fechaActualizacion: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      tableName: 'basurero',
      timestamps: false
    });
  
    Basurero.associate = function(models) {
      Basurero.hasMany(models.Historial, { foreignKey: 'idBasurero' });
      Basurero.hasMany(models.Notificacion, { foreignKey: 'idBasurero' });
    };
  
    return Basurero;
  };
  
  