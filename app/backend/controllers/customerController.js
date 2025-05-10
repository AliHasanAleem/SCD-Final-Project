const bcrypt = require('bcrypt');
const Customer = require('../models/customerSchema.js');
const { createNewToken } = require('../utils/token.js');

const customerRegister = async (req, res) => {
    try {
        // Ensure the request body contains the required fields
        if (!req.body.email || !req.body.password) {
            return res.status(400).send({ message: "Email and password are required" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const customer = new Customer({
            ...req.body,
            password: hashedPass
        });

        const existingcustomerByEmail = await Customer.findOne({ email: req.body.email });

        if (existingcustomerByEmail) {
            res.status(400).send({ message: 'Email already exists' });
        } else {
            let result = await customer.save();
            result.password = undefined;

            const token = createNewToken(result._id);
            result = {
                ...result._doc,
                token: token
            };

            res.status(201).send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const customerLogIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: "Email and password are required" });
        }

        let customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(404).send({ message: "User not found" });
        }

        const validated = await bcrypt.compare(password, customer.password);
        if (!validated) {
            return res.status(401).send({ message: "Invalid password" });
        }

        customer.password = undefined;

        let token;
        try {
            token = createNewToken(customer._id);
        } catch (tokenErr) {
            console.error("Token generation failed:", tokenErr);
            return res.status(500).json({ message: "Token generation failed" });
        }

        customer = {
            ...customer._doc,
            token: token
        };

        res.send(customer);

    } catch (err) {
        console.error("Error in customerLogIn:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

const getCartDetail = async (req, res) => {
    try {
        let customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).send({ message: "No customer found" });
        }

        res.send(customer.cartDetails);

    } catch (err) {
        console.error("Error in getCartDetail:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

const cartUpdate = async (req, res) => {
    try {
        let customer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!customer) {
            return res.status(404).send({ message: "No customer found to update" });
        }

        res.send(customer.cartDetails);

    } catch (err) {
        console.error("Error in cartUpdate:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

module.exports = {
    customerRegister,
    customerLogIn,
    getCartDetail,
    cartUpdate,
};
