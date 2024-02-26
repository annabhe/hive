const express = require('express');
const router = express.Router();

const Users = require('../models/user.model');

// save selected avatar
router.post('/', (req, res) => {
    const submittedUser = req.body.username;
    const avatar = {
        name: req.body.avatarName,
        index: req.body.avatarIndex
    }

    Users.findOneAndUpdate({username: submittedUser}, {avatar: avatar})
    .then(() => {
        res.json({
            success: true,
            message: "Saved Avatar"
        });
    })
    .catch((err) => {
        res.json({
            successful: false,
            message: err
        })
    })

})

// get avatar info
router.get('/:username', (req,res) => {
    const submittedUser = req.params.username;

    Users.findOne({username: submittedUser})
    .then((user) => {
        if (!user) {
            res.json({
                success: false,
                message: "User not found"
            })
        } else {
            const avatar = user.avatar;
            if (avatar) {
                res.json({
                    success: true,
                    avatar: avatar,
                    message: "Found user and avatar"
                })
            } else {
                res.json({
                    success: false,
                    message: "Avatar not found"
                });
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

module.exports = router;