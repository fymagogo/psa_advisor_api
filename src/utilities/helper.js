const bcrypt = require('bcrypt');



    hashPassword = (password) => {
        hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
        return hashedPassword;
    },

    comparePassword = (password, hashedPassword) => {
        return bcrypt.compareSync(password, hashedPassword)
    },

    isValidEmail = (email) =>{
        return /\S+@\S+\.\S+/.test(email)
    }


module.exports = {
    hashPassword, comparePassword, isValidEmail
}