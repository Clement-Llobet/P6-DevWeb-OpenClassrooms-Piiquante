const req = require('express/lib/request');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decodedToken.userId;
        req.auth = { userId };
        if (req.body._id && req.body._id !== userId) {
            throw 'UserId non valable !'
        }
        else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !'});
    }
}