const Sequelize = require('sequelize');

const db = new Sequelize({
    username: 'rssmanager',
    password: 'rsspass',
    database: 'rssproject',
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }

});

const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING,
        unique: true
    },
    email: Sequelize.STRING,
    password: Sequelize.STRING
});

const AuthToken = db.define('authtoken', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    token: {
        type: Sequelize.STRING,
        unique: true,
        index: true
    }
});

const Feeds = db.define('feeds', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

AuthToken.belongsTo(User);
User.hasMany(AuthToken);

Feeds.belongsTo(User);
User.hasMany(Feeds);

db.sync({force: false}).then(() => {
    console.log('Database is synchronised');
});

module.exports = {
    User, AuthToken, Feeds
};

