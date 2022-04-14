const Sauces = require('../models/sauces');

exports.postSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauces({
        // ...req.body // Pas de vérification des champs
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    sauce.save()
        .then(() => res.status(200).json({ message: 'Sauce enregistrée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.putSauce = (req, res, next) => {
    Sauces.updateOne({ userId: req.params.id }, { ...req.body, userId: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
        if (!sauce) {
            res.status(404).json({ error: new Error("La sauce recherché n'existe pas !")});
        }
        if (sauce.userId !== req.auth.userId) {
            res.status(400).json({ error: new Error("Requêt non autorisée !")});
        }
        Sauces.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(400).json({ error }))
};

// FONCTION A VERIFIER
exports.postSpecificSauceLike = (req, res, next) => {
    Sauces.findOne({ userId: req.params.id })
    .save()
        .then(() => res.status(200).json({ message: 'Like enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.getSauces = (req, res, next) => {
    Sauces.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};

exports.getSpecificSauce = (req, res, next) => {
    Sauces.findOne({ userId: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};