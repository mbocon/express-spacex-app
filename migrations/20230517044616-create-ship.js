'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ships', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      legacy_id: {
        type: Sequelize.STRING
      },
      model: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      active: {
        type: Sequelize.BOOLEAN
      },
      imo: {
        type: Sequelize.INTEGER
      },
      mmsi: {
        type: Sequelize.INTEGER
      },
      abs: {
        type: Sequelize.INTEGER
      },
      class: {
        type: Sequelize.INTEGER
      },
      mass_kg: {
        type: Sequelize.INTEGER
      },
      year_built: {
        type: Sequelize.INTEGER
      },
      home_port: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      speed_kn: {
        type: Sequelize.DECIMAL
      },
      course_deg: {
        type: Sequelize.DECIMAL
      },
      latitude: {
        type: Sequelize.DECIMAL
      },
      last_ais_update: {
        type: Sequelize.STRING
      },
      link: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ships');
  }
};