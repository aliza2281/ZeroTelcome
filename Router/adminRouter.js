const express = require('express');
const router = express.Router();
const adminModel = require('../Models/adminModel')
const clientModel = require('../Models/clientModel')


router.post('/create', (req, res) => {
    let obj = {
        id: req.body.id,
        userName: req.body.userName,
        password: req.body.password
    }

    adminModel.createAdmin(obj)
        .then((data) => {
            return res.status(200).json(data)
        })
        .catch((err) => {
            return res.status(404).json(err)
        })

})
router.post('/login', (req, res) => {
    let obj = {
        id: req.body.id,
        password: req.body.password
    }

    adminModel.loginAdmin(obj)
        .then((result) => {
            if (result.isSucsees) {
                adminModel.setCookies(result.userId, req, res)
                return res.status(200).json("admin" + result.userId)
            }
            else {
                return res.status(200).json("okjoklkj")
            }

        })
        .catch((err) => {
            return res.status(404).json(err)
        })
})


router.post('/setupdate', (req, res) => {
    adminModel.validateInfo()
        .then((admin) => {
            if (admin) {
                clientModel.activeNotActive(req.body.clientid)
                    .then((update) => {
                        return res.status(200).json(update)
                    })
            }
        })
        .catch((err) => {
            return res.status(200).json(err)
        })
})

router.get('/getusers', (req, res) => {

    adminModel.validateInfo()
        .then((admin) => {
            if (admin.isSucsees) {
                clientModel.getUsers()
                    .then((data) => {
                        return res.status(200).json(data)
                    })
                    .catch((err) => {
                        return res.status(404).json(err)
                    })
            }
        })
        .catch((err) => {
            return res.status(200).json(err)
        })

})


module.exports = router;