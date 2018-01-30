module.exports = (sequelize, DataTypes) => {
  return sequelize.define('nests', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pokemon: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reported_by: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reported_on: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });
};
