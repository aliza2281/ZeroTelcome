const mongoose = require('mongoose');

const packageScheme = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    nimutes: {
        type: Number,
        required: true
    },
    giga: {
        type: Number,
        required: true
    },
    callsAbroads: {
        type: Number,
        required: true
    }

})

const packageTable = mongoose.model('packages', packageScheme);


createPackage = (data) => {
    let p = new Promise((resolve, reject) => {
        packageTable.findOne({ name: data.name })
            .then((package) => {
                if (package) {
                    reject({ err: "Package already exists" })
                }
                else {
                    let packageObj = packageTable({
                        name: data.name,
                        nimutes: data.nimutes,
                        giga: data.giga,
                        callsAbroads: data.callsAbroads
                    });
                    packageObj.save();
                    resolve(packageObj);
                }
            })
    })
    return p;
}

getAll = () => {
    let p = new Promise((resolve, reject) => {

        packageTable.find()
            .then((package) => {
                if (package) return resolve(package)
                else return reject('error ')
            })
    });
    return p
}

findPackage = (data) => {
    console.log(data)
    let p = new Promise((resolve, reject) => {
        packageTable.findOne({ _id: data })
            .then((package) => {
                if (package) {
                    return resolve(package)
                }
                else {
                    return reject({ err: 'package not exist' })
                }

            })
            .catch((err) => {
                return reject({ err: err })
            })
    })
    return p;
}


findClientLines = (data) => {
    let packages = []
    let p = new Promise((resolve, reject) => {
        data.map((x) => {
            packageTable.findOne({ _id: x })
                .then((package) => {
                    if (package) {
                        packages.push(package)
                    }
                    else {
                        return reject({ err: 'package not exist' })
                    }
                    if (packages) {
                        return resolve(packages)

                    }

                })
                .catch((err) => {
                    return reject({ err: err })
                })
        })
    })

    return p;
}

module.exports = {
    createPackage: createPackage,
    getAll: getAll,
    findPackage: findPackage,
    findClientLines:findClientLines
}



