const Sauces = require('../models/sauces');

exports.postSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauces({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    sauce.save()
        .then(() => res.status(200).json({ message: 'Sauce enregistrée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.putSauce = (req, res, next) => {
    Sauces.updateOne({ userId: req.params.id }, { sauceObject, userId: req.params.id })
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
            res.status(400).json({ error: new Error("Requête non autorisée !")});
        }
        Sauces.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(400).json({ error }))
};

// FONCTION A VERIFIER
exports.postSpecificSauceLike = (req, res, next) => {
    console.log(req);

        Sauces.findOneAndUpdate(
            { _id: req.params.id },
            { 
                likes: 1,
                usersLiked: [userId]
            },
            { useFindAndModify: false },
        )
            .then(() => res.status(200).json({ message: "like ajouté"}))
            .catch(error => res.status(400).json({ error }))
    

    

    // Si like = 1, l'utilisateur aime
    // Si like = 0, l'utilisateur retire son like
    // L'ID de l'utilisateur doit être ajouté ou retiré du tableau approprié.
    // Cela permet de garder une trace de leurs préférences et les empêche de liker 
    // ou de ne pas disliker la même sauce plusieurs fois : un utilisateur ne peut 
    // avoir qu'une seule valeur pour chaque sauce.
    // Le nombre total de « Like » et de « Dislike » est mis à jour à chaque nouvelle notation.
};

exports.getSauces = (req, res, next) => {
    Sauces.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};

exports.getSpecificSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};