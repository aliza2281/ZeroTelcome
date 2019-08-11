const express = require('express');
const router = express.Router();
const clientModel = require('../Models/clientModel');
const registerValidation = require('../validation/users/registerValidation')
const loginValidation = require('../validation/users/loginValidation')
const packageModel = require('../Models/packageModel');


router.get('/all', (req, res) => {
    clientModel.getAll()
        .then((data) => {
            return res.status(200).json(data)
        })
        .catch((err) => {
            return res.status(404).json(err)
        })
})

router.post('/register', (req, res) => {
    const { error, isVaild } = registerValidation(req.body)
    if (!isVaild) {
        return res.status(200).json({ error: error });
    }
    else {
        clientModel.createClient(req.body)
            .then((data) => {
                return res.status(200).json(data)
            })
            .catch((err) => {
                return res.status(404).json({ err: err });
            })
    }
})


router.post('/login', (req, res) => {
    let { error, isVaild } = loginValidation(req.body);
    if (!isVaild) {
        return res.status(200).json({ error })
    }
    else {
        clientModel.loginClient(req.body)
            .then((result) => {
                if (result.isSucsees) {
                    clientModel.setCookies(result.userId, req, res)
                    clientModel.validateInfo()
                    return res.status(200).json(result.userName)
                }
                else {
                    return res.status(404).json("wrong")
                }

            })
            .catch((err) => {
                return res.status(404).json(err)
            })
    }
}

)

router.post('/logout', (req, res) => {


    clientModel.logoutClient()
        .then((data) => {
            return res.status(200).json(data)
        })
        .catch((err) => {
            return res.status(404).json(err)
        })

})


router.post('/addPackage', (req, res) => {
    
    clientModel.validateInfo()
        .then((data) => {
            packageModel.findPackage(req.body.id)
                .then((result) => {
                    clientModel.addPackage(data, result)
                        .then((packageadd) => {
                            return res.status(200).json(packageadd)
                        })
                        .catch((err) => {
                            return res.status(404).json(err)
                        })
                })
                .catch((err) => {
                    return res.status(404).json(err)
                })
        })
        .catch((err) => {
            return res.status(404).json(err)
        })
})
router.get('/showPackage', (req, res) => {
    clientModel.clientLines()
        .then((data) => {
            packageModel.findClientLines(data)
                .then((package) => {
                    return res.status(200).json(package)
                })
        })
        .catch((err) => {
            return res.status(404).json({ err: err })

        })
})

router.post('/deletePackage', (req, res) => {
    clientModel.deleteLines(req.body.delete)
        .then((package) => {
            return res.status(200).json(package)
        })
        .catch((err) => {
            return res.status(404).json(err)

        })
})

router.get('/isLoggedin', (req,res)=>{
    clientModel.validateInfo()
    .then((data)=>{
        return res.status(200).json(data.firstName)
    })
    .catch((err)=>{
        return res.status(404).json(err)
    })
})


module.exports = router;