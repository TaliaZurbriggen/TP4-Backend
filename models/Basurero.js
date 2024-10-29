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
      type: DataTypes.DATE,
      allowNull: false
    }    
  }, {
    tableName: 'basurero',
    timestamps: false
  });
  return Basurero;
};
