'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ship extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ship.init({
    name: DataTypes.STRING,
    legacy_id: DataTypes.STRING,
    model: DataTypes.STRING,
    type: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    imo: DataTypes.INTEGER,
    mmsi: DataTypes.INTEGER,
    abs: DataTypes.INTEGER,
    class: DataTypes.INTEGER,
    mass_kg: DataTypes.INTEGER,
    year_built: DataTypes.INTEGER,
    home_port: DataTypes.STRING,
    status: DataTypes.STRING,
    speed_kn: DataTypes.DECIMAL,
    course_deg: DataTypes.DECIMAL,
    latitude: DataTypes.DECIMAL,
    last_ais_update: DataTypes.STRING,
    link: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ship',
  });
  return ship;
};