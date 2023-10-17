const db = require("../models");
const Phones = db.phones;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const { contactId } = req.params;
    const { name, number } = req.body;

    if (!name || !number) {
        return res.status(400).json({ message: 'Name and number cannot be empty' });
    }

    Phones.create({
        name,
        number,
        contactId,
    })
        .then(phone => {
            res.json(phone);
        })
        .catch(err => {
            res.status(500).json({
                message: err.message || 'Some error occurred while creating the phone number',
            });
        });
};

exports.findAll = (req, res) => {
    const { contactId } = req.params;

    Phones.findAll({
        where: { contactId },
    })
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({
                message: err.message || 'Some error occurred while retrieving phone numbers',
            });
        });
};

exports.findOne = (req, res) => {
    const { contactId, phoneId } = req.params;

    Phones.findOne({
        where: { id: phoneId, contactId },
    })
        .then(phone => {
            if (!phone) {
                return res.status(404).json({ message: 'Phone number not found' });
            }
            res.json(phone);
        })
        .catch(err => {
            res.status(500).json({
                message: err.message || 'Some error occurred while retrieving the phone number',
            });
        });
};

exports.update = (req, res) => {
    const { contactId, phoneId } = req.params;
    const { name, number } = req.body;

    if (!name || !number) {
        return res.status(400).json({ message: 'Name and number cannot be empty' });
    }

    Phones.update(
        { name, number },
        { where: { id: phoneId, contactId } }
    )
        .then(() => {
            res.json({ message: 'Phone number updated successfully' });
        })
        .catch(err => {
            res.status(500).json({
                message: err.message || 'Some error occurred while updating the phone number',
            });
        });
};

exports.delete = (req, res) => {
    const { contactId, phoneId } = req.params;

    Phones.destroy({
        where: { id: phoneId, contactId },
    })
        .then(() => {
            res.json({});
        })
        .catch(err => {
            res.status(500).json({
                message: err.message || 'Some error occurred while deleting the phone number',
            });
        });
};