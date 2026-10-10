const { body, validationResult } = require('express-validator');

const validateContact = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .escape(),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email address')
        .normalizeEmail(),
    body('message')
        .trim()
        .notEmpty()
        .withMessage('Message is required')
        .escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

module.exports = {
    validateContact,
};
