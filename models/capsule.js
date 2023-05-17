'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class capsule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  capsule.init({
    reuse_count: DataTypes.INTEGER,
    water_landings: DataTypes.INTEGER,
    last_update: DataTypes.STRING,
    serial: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'capsule',
  });
  return capsule;
};