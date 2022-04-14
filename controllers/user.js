const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');
const Users = require('../models/users');

exports.postSignUp = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new Users({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: "Utilisateur créé !"}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.postLogin = (req, res, next) => {
    Users.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: "Utilisateur non trouvé !"});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({ error: "Mot de passe incorrect !"});
                    }
                    res.status(200).json({
                        userId: user.userId,
                        token: jwt.sign(
                            { userId: user.userId },
                            process.env.TOKEN_SECRET, // Générateur aléatoire
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json( error ))
        })
        .catch(error => res.status(500).json( error ))
};