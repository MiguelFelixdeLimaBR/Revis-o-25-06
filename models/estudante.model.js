const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const Estudante = sequelize.define(
    'Estudante',
    {
    nome: {
        type: DataTypes.STRING,
    },
    idade: {
        type: DataTypes.INTEGER,
    },
    },
    {
        tableName: 'Estudantes',
        timestamps: true
    }
);

module.exports = Estudante;