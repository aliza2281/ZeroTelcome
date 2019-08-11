const validator = require('validator');
const IsEmpty = require('../is-empty');

module.exports = function loginValidation(data){

    let error = {}

    data.id = !IsEmpty(data.id) ? data.id : '';
    data.password = !IsEmpty(data.password) ? data.password : '';


    if(validator.isEmpty(data.id)){
        error.id = 'enter id'
    }

    if(validator.isEmpty(data.password)){
        error.password = 'enter password'
    }

    return {
        error,
        isVaild : IsEmpty(error)
    }
    
}