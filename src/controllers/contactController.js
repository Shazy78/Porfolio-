const ContactModel = require('../models/contactModel');

const submitContact = async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const newMessage = await ContactModel.saveMessage(name, email, message);
        res.status(201).json({
            message: 'Message sent successfully',
            data: {
                id: newMessage.id,
                name: newMessage.name,
                email: newMessage.email,
                created_at: newMessage.created_at
            }
        });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    submitContact,
};
