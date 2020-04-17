'use strict';

const { Sequelize, Model, DataTypes } = require('sequelize');

const sequelize = new Sequelize('mysql', 'root', 'root', {
    host: 'localhost',
    port: '3306',
    dialect: 'mariadb',
});

class User extends Model {}
User.init({
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    birthday: DataTypes.DATE,
    metadata: DataTypes.JSON,
  }, { sequelize, modelName: 'user' });

async function init() {
    await sequelize.sync();

    await User.create({
        name: 'Jane Doe',
        username: 'janedoe',
        birthday: new Date(1980, 4, 05),
        metadata: {
            age: 42,
        }
    });

    await User.create({
        name: 'John Doe',
        username: 'johndoe',
        birthday: new Date(1981, 3, 15),
        metadata: {
            age: 41,
        }
    });
}

async function getUsersByMetadata(key, value) {
    // sql injection
    const where = {metadata: {}};
    where.metadata[key] = value;
    // {metadata: {"age')) AS DECIMAL) > 40- UNION SELECT VERSION(); -- ": value}},

    return await User.findAll({
        where: where,
        attributes: ['name'],
        raw: true,
    });
}

async function getUsersByMetadataJson(input) {
    // "metadata.kids')) = 2 UNION SELECT VERSION(); -- "
    await User.findAll({
        where: {name: sequelize.json(input, 2)},
        attributes: ['name'],
        raw: true,
    });
}

module.exports = {
    init,
    getUser,
    createUser
}