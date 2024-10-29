module.exports = (sequelize, DataTypes) => {
    const Basurero = sequelize.define('Basurero', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      distancia_promedio: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      fecha: {
        type: DataTypes.TEXT,
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
  
  