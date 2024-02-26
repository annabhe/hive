const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../models/user.model.js');

// signup
router.post('/signup', (req, res) => {
    const submittedUser = req.body.username;
    const submittedPass = req.body.password;

    Users.exists({username: submittedUser})
    .then((result) => {
        // check if username is already taken
        if (result) {
            res.status(400).send(new Error('User already exists!'));
        // create user
        } else {
            // hash password
            const SALT_ROUNDS = 10;
            bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
                bcrypt.hash(submittedPass, salt, (err, hash) => {
                    // store hashed password in DB
                    Users.create({
                        username: submittedUser,
                        password: hash
                    })
                    .then(() => {
                        res.json({
                            success: true,
                            message: "Successfully created account!"
                        });
                    })
                    .catch((err) => {
                        res.json({
                            success: false,
                            message: err
                        });
                    })
                })
            })
        }
    })
})

// login
router.post('/login', (req, res) => {
    const submittedUser = req.body.username;
    const submittedPass = req.body.password;

    Users.findOne({username: submittedUser})
    .then((user) => {
        // user does not exist
        if (!user) {
            res.status(400).send(new Error('user does not exist!'));
        // check password
        } else {
            bcrypt.compare(submittedPass, user.password, (err, matches) => {
                if (err) {
                    console.log(err);
                }
                // send info to frontend given that there are results
                if (matches) {
                    console.log(`User ${submittedUser} is Authenticated`);
                    // create jwt
                    const token = jwt.sign({
                        username: submittedUser
                    }, 'Super Secret', {
                        expiresIn: 3600
                    });

                    res.json({
                        success: true,
                        message: "Successful login",
                        username: user.username,
                        token
                    })
                // wrong password
                } else {
                    console.log("User is NOT Authenticated");
                    res.status(400).send(new Error('incorrect password!'))
                }
            })
        }
    })
    .catch((err) => {
        console.log(err);
    })
})

module.exports = router;
