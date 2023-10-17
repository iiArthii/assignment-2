module.exports = (sequelize, Sequelize) => {
    const Phone = sequelize.define("phone", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        phoneType: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        phoneNumber: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        // DEFINE YOUR MODEL HERE
    });
  
    return Phone;
};