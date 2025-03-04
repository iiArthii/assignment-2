module.exports = (sequelize, Sequelize) => {
    const Phone = sequelize.define("phone", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
        },
        number: {
            type: Sequelize.STRING,
        },
        contactId: {
            type: Sequelize.INTEGER,
        },
    });

    Phone.associate = (models) => {
        Phone.belongsTo(models.Contact, {
            foreignKey: 'contactId',
        });
    };

    return Phone;
};
