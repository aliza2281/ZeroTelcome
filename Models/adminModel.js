const mongoose = require('mongoose');

const adminScheme = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
    }


})

const adminTable = mongoose.model('admins', adminScheme);


createAdmin = (data) => {
    let p = new Promise((resolve, reject) => {
        adminTable.findOne({ id: data.id })
            .then((admin) => {
                if (admin) {
                    return resolve({ err: "admin already exists" })
                }
                else {
                    let adminObj = adminTable({
                        id: data.id,
                        userName: data.userName,
                        password: data.password
                    });
                    adminObj.save();
                    return resolve(adminObj)
                }
            })
    })
    return p;
}


loginAdmin = (data) => {

    let p = new Promise((resolve, reject) => {
        let obj = {
            isSucsees: false,
            userId: ""
        }
        adminTable.findOne({ id: data.id, password: data.password })
            .then((admin) => { 
                if (admin) {
                    obj.isSucsees = true;
                    obj.userId = admin._id
                    return resolve(obj)
                }
                else {
                    return reject(obj)
                }
            })
    })
    return p;
}

var cookies;

setCookies = (data, req, res) => {

    if (!cookies) {
        cookies = req.session;
        cookies.user = data
    }
    else {
        cookies.user = data
    }
}
validateInfo = () => {
    let p = new Promise((resolve, reject) => {
        if (cookies) {
            adminTable.findOne({ _id: cookies.user })
                .then((result) => {
                    if (result) {
                        return resolve(result)
                    }
                    else {
                        return  resolve({err:'admin not found'})
                    }
                })
        }
        else {
            resolve({err:'you need to log in '})
        }
    })
    return p
}

getCookies = () => {
    return cookies;
}
module.exports = {
    createAdmin:createAdmin,
    loginAdmin:loginAdmin,
    setCookies:setCookies,
    validateInfo:validateInfo
}



