const express = require('express');
const router = express.Router();

const Users = require('../models/user.model');

// save selected pet
router.post('/', (req, res) => {
    const submittedUser = req.body.username;
    const pet = {
        name: req.body.petName,
        petIndex: req.body.petIndex
    }

    Users.findOneAndUpdate({username: submittedUser}, {pet: pet})
    .then(() => {
        res.json({
            success: true,
            message: "Saved Pet"
        });
    })
    .catch((err) => {
        res.json({
            successful: false,
            message: err
        })
    })
})

// get pet info
router.get('/:username', (req, res) => {
    const submittedUser = req.params.username;

    Users.findOne({username: submittedUser})
    .then((user) => {
        if (!user) {
            res.json({
                success: false,
                message: "User not found"
            })
        } else {
            const pet = user.pet;
            if (pet) {
                res.json({
                    success: true,
                    pet: pet,
                    message: "Found user and pet"
                })
            } else {
                res.json({
                    success: false,
                    message: "Pet not found"
                })
            }
        }
    })
    .catch((err) => {
        res.json({
            success: false,
            message: err
        })
    })
})

module.exports = router