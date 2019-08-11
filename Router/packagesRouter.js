const express = require('express');
const router = express.Router();
const packageModel = require('../Models/packageModel');

router.post('/create', (req, res) => {
    packageModel.createPackage(req.body)
        .then((data) => {
            return res.status(200).json(data)
        })
        .catch((err) => {
            return res.status(404).json(err)
        })

})
router.get('/all', (req, res) => {
    packageModel.getAll()
        .then((data) => {
            return res.status(200).json(data)
        })
        .catch((err) => {
            return res.status(404).json(err)
        })

})

router.get('/find', (req, res) => {
    packageModel.getAll()
        .then((data) => {
            return res.status(200).json(data)
        })
        .catch((err) => {
            return res.status(404).json(err)
        })

})


module.exports = router;