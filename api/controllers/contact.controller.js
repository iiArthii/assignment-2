const db = require("../models");
const Contacts = db.contacts;
const Phones = db.phones;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).send({ message: 'Name cannot be empty' });
    }

    const contact = {
        name,
    };

    Contacts.create(contact)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'An error has occurred while creating the contact',
            });
        });
};

exports.findAll = (req, res) => {
    Contacts.findAll()
        .then(data => {
            const modifiedData = data.map(contact => {
                return {
                    id: contact.id,
                    name: contact.name,
                };
            });
            res.send(modifiedData);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error has occurred"
            });
        });
};

exports.findOne = (req, res) => {
    const { contactId } = req.params;

    Contacts.findByPk(contactId)
        .then(contact => {
            if (!contact) {
                return res.status(404).send({ message: 'Contact not found' });
            }
            res.send(contact);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'An error has occurred while retrieving the contact',
            });
        });
};

exports.update = (req, res) => {
    const { contactId } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).send({ message: 'Name cannot be empty' });
    }

    Contacts.findByPk(contactId)
        .then(contact => {
            if (!contact) {
                return res.status(404).send({ message: 'Contact not found' });
            }

            contact.name = name;

            contact.save()
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || 'An error has occurred while updating the contact',
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'An error has occurred while updating the contact',
            });
        });
};

exports.delete = (req, res) => {
    const { contactId } = req.params;

    Contacts.findByPk(contactId)
        .then(contact => {
            if (!contact) {
                return res.status(404).send({ message: 'Contact not found' });
            }

            contact.destroy()
                .then(() => {
                    res.send({});
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || 'An error has occurred while deleting the contact',
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'An error has occurred while deleting the contact',
            });
        });
};

