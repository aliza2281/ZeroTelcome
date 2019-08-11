const mongoose = require('mongoose');

const clientScheme = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        min: 5,
        required: true
    },
    adress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    birthDay: {
        type: Date,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    isBuisness: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lines: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'packages'
    }


})

const clientTable = mongoose.model('clients', clientScheme);


createClient = (data) => {

    let p = new Promise((resolve, reject) => {
        clientTable.findOne({ id: data.id })
            .then((user) => {
                if (user) {
                    return reject("User already exists")
                }
                else if (data.password.length <= 4) {
                    return reject("Password must be longer than 4 charecters")
                }
                else {
                    let clientObj = clientTable({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        id: data.id,
                        password: data.password,
                        adress: data.adress,
                        city: data.city,
                        birthDay: data.birthDay
                    });
                    clientObj.save();
                    return resolve(clientObj)
                }
            })
            .catch((err) => {
                return reject({err:err})
            })
    })
    return p;
}

loginClient = (data) => {
    let p = new Promise((resolve, reject) => {
        let obj = {
            isSucsees: false,
            userId: "",
            userName: ""
        }
        clientTable.findOne({ id: data.id, password: data.password })
            .then((user) => {
                if (user) {
                    obj.isSucsees = true;
                    obj.userId = user._id
                    obj.userName = user.firstName
                    return resolve(obj)
                }
                else {
                    return reject({ err: "Id or password incorrect" })
                }
            })
            .catch((err) => {

                return reject({ err: err })
            })
    })
    return p;
}

logoutClient = () => {
    let p = new Promise((resolve, reject) => {
        if (cookies) {
            clientTable.findOne({ _id: cookies.user })
                .then((result) => {
                    if (result) {
                        cookies = ""
                        return resolve("You are logged out")
                    }
                    else {
                        reject('Error try again')
                    }
                })
                .catch((err) => {
                    return resolve({ err: err })
                })
        }
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

getCookies = () => {
    return cookies;
}

validateInfo = () => {
    let p = new Promise((resolve, reject) => {
        if (cookies) {
            clientTable.findOne({ _id: cookies.user })
                .then((result) => {
                    if (result) {
                        return resolve(result)
                    }
                    else {
                        reject('user not found')
                    }
                })
                .catch((err) => {
                    return reject({ err: err })
                })
        }

        else {
            return reject('You need to log in ')
        }
    })
    return p;
}

addPackage = (Client, packageData) => {
    let p = new Promise((resolve, reject) => {
        if (Client.isBuisness === false && Client.lines.length === 0) {

            clientTable.findOneAndUpdate(
                { _id: Client._id },
                { $push: { lines: packageData } }
            )
                .then((package) => {
                    if (package) {
                        return resolve("New package ")
                    }
                    else {
                        return reject( "You can't add package" )
                    }
                })

                .catch((err) => {
                    return reject({ err: err })
                })
        }
        else if (Client.isBuisness === true && Client.lines.length <= 2) {

            clientTable.findOneAndUpdate(
                { _id: Client._id },
                { $push: { lines: packageData } }
            )
                .then((package) => {
                    if (package) {
                        return resolve("New package")
                    }
                    else {
                        return reject("You cant add package ")
                    }
                })

                .catch((err) => {
                    return reject({ err: err })
                })

        }
        else {
            return reject("You can't add package ")
        }

    })
    return p;
}

activeNotActive = (clientid) => {

    let p = new Promise((resolve, reject) => {
        clientTable.findOne({ id: clientid })
            .then((clientData) => {
                clientData.isActive = !clientData.isActive;
                clientData.save();
                resolve(clientData)
            })
            .catch((err) => {
                return resolve({ err })
            })
    })

    return p;
}

getUsers = () => {
    let p = new Promise((resolve, reject) => {
        clientTable.find()
            .then((clients) => {
                var result = clients.sort(function (a, b) {
                    return b.isActive - a.isActive
                })
                return resolve(result)
            })
            .catch((err) => {
                return resolve(err)
            })
    })
    return p
}

getAll = () => {
    let p = new Promise((resolve, reject) => {

        clientTable.find()
            .then((users) => {
                if (users) return resolve(users)
                else return reject('error ')
            })
            .catch((err) => {
                return resolve(err)
            })
    });
    return p
}

clientLines = () => {
    let p = new Promise((resolve, reject) => {
        if (cookies) {
            clientTable.findOne({ _id: cookies.user })
                .then((result) => {
                    if (result && result.lines) {
                        return resolve(result.lines)
                    }
                    else {
                        return reject('User not found')
                    }
                })
                .catch((err) => {
                    return reject({ err: err })
                })
        }
        else {
            return reject('You need to log in ')
        }
    })

    return p
}

deleteLines = (data) => {
    let p = new Promise((resolve, reject) => {
        if (cookies) {
            clientTable.findOne({ _id: cookies.user })
                .then((result) => {
                    result.lines.find((line) => {
                        if (line == data) {
                            clientTable.update(
                                { _id: result._id },
                                { $pull: { lines: line } }
                            )
                                .then((newpackage) => {
                                    if (newpackage) {
                                        return resolve(newpackage)
                                    }
                                    else return resolve(result)
                                })
                                .catch((err) => {
                                    return resolve({ err: err })
                                })
                        }
                    })
                })
        }
        else {
            reject('You need to log in ')
        }
    })
    return p
}


module.exports = {
    createClient: createClient,
    loginClient: loginClient,
    logoutClient: logoutClient,
    setCookies: setCookies,
    getCookies: getCookies,
    getAll: getAll,
    validateInfo: validateInfo,
    addPackage: addPackage,
    activeNotActive: activeNotActive,
    getUsers: getUsers,
    clientLines: clientLines,
    deleteLines: deleteLines
}



