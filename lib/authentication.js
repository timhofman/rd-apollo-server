import jwt from 'jsonwebtoken';
const APP_SECRET = 'g43Eluihe83lge';

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