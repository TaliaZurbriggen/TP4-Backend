module.exports = (sequelize, DataTypes) => {
    const Historial = sequelize.define('Historial', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      fecha: {
        type: DataTypes.DATE,
        allowNull: false
      },
      hora: {
        type: DataTypes.TIME,
        allowNull: false
      },
      idBasurero: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Basurero',
          key: 'id'
        }
      }
    }, {
      tableName: 'historial',
      timestamps: false
    });
  
    return Historial;
  };
  
  