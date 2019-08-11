const validator = require('validator');
const IsEmpty = require('../is-empty');

module.exports = function RegisterValidator(data){
    let error = {}
    data.firstName = !IsEmpty(data.firstName) ? data.firstName : '';
    data.lastName = !IsEmpty(data.lastName) ? data.lastName : '';
    data.id = !IsEmpty(data.id) ? data.id : '';
    data.city = !IsEmpty(data.city) ? data.city : '';
    data.adress = !IsEmpty(data.adress) ? data.adress : '';
    data.birthDay = !IsEmpty(data.birthDay) ? data.birthDay : '';
    data.password = !IsEmpty(data.password) ? data.password : '';

 
    if(validator.isEmpty(data.firstName)){error.firstName = 'Please enter first name'}

    if(validator.isEmpty(data.lastName)){error.lastName = 'Please enter last name'}

    if(validator.isEmpty(data.id)){
        error.id = 'Please enter your id'
    }
    else if(!validator.isLength(data.id,{min: 9,max : 9})){
        error.id = 'Id must contain 9 digits'
    }
    if(validator.isEmpty(data.password)){
        error.password = 'Please enter password'
    }
    else if(!validator.isLength(data.password,{min: 5})){
        error.password = 'Password must contain 5 digits'
    }
    if(validator.isEmpty(data.adress)){error.adress = 'Please enter address'}
    if(validator.isEmpty(data.city)){error.city = 'Please enter city'}
    if(validator.isEmpty(data.birthDay)){error.birthDay = 'Please enter birthDay'}
    return {
        error,
        isVaild : IsEmpty(error)
    }

    
}