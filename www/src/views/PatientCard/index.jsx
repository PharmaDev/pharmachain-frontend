var moment = require('moment');

module.exports = {
    template: require('./template.html'),
    replace: true,
    data: function () {
        return {
            firstName: "",
            lastName: "",
            birthday: "",
            insurance: "",
            hasDefaultAdress: false,
            defaultStreet:"",
            defaultCity:"",
            defaultPostcode:""
        }
    },
    created: function () {
        if(defaultStreet!="" && defaultCity!="" && defaultPostcode!=""){
            hasDefaultAdress = true;
        }
    }
};