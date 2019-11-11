const jwt = require('jsonwebtoken');
const APP_SECRET = 'g43Eluihe83lge';

const AuthenticationError = require('apollo-server');

/**
 * 
 * @param {*} token 
 */
function authenticate(req) {

    let token = null;
    if (req.headers.authorization) {
        token = req.headers.authorization.replace('Bearer ', '')
    }
    return (token !== null && token == 'WFxmEAPpVwimkhyLjNTV');
}

module.exports = {
    APP_SECRET,
    authenticate
}