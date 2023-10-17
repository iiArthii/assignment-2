module.exports = (sequelize, Sequelize) => {
    const Contact = sequelize.define("contact", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    });

    Contact.associate = (models) => {
        Contact.hasMany(models.Phone, {
            foreignKey: 'contactId',
        });
    };

    return Contact;
};