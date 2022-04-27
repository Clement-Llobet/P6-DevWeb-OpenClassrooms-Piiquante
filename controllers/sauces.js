const Sauces = require('../models/sauces');
const fs = require('fs');

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
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                return res.status(404).json({ error: new Error("La sauce recherché n'a pas été trouvée.")});
            }
            
            if (sauce.userId !== req.auth.userId) {
                return res.status(401).json({ error: new Error("Requête non autorisée !")});
            }

            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauces.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }))
};

// FONCTION A VERIFIER
exports.postSpecificSauceLike = (req, res, next) => {
    const likeOrDislike = req.body.like
    console.log(likeOrDislike);

    switch (likeOrDislike) {
        case 1:
            Sauces.findOneAndUpdate(
                { _id: req.params.id },
                { $inc: { likes: +1 }, $push: { usersLiked: req.body.userId } },
                // { useFindAndModify: false }
            )
                .then(() => res.status(200).json({ message: "Like ajouté"}))
                .catch(error => res.status(400).json({ error }))
        break;
        case 0 :
            
            console.log("findOneAndUpdate");

            Sauces.findOne(
                { _id: req.params.id }
            )
            .then(
                (sauce) => {
                    console.log(sauce, req.auth.userId);

                    const findUserDisliked = sauce.usersDisliked.find(user => user === req.body.userId);
                    const findUserLiked = sauce.usersLiked.find(user => user === req.body.userId);

                    console.log(findUserDisliked, findUserLiked);

                    if (findUserDisliked) {
                        Sauces.updateOne( { _id: req.params.id },
                             {
                                 $inc: { dislikes: -1 },
                                 $pull: { usersDisliked: req.body.userId }
                            }
                        )
                            .then(() => res.status(200).json({ message: "Like modifié"}))
                            .catch(error => res.status(400).json({ error }))
                    }
                    else if (findUserLiked) {
                        Sauces.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { likes: -1 },
                                $pull: { usersLiked: req.body.userId }
                            }
                        )
                            .then(() => res.status(200).json({ message: "Like modifié"}))
                            .catch(error => res.status(400).json({ error }))
                    }
                } 
            )
        break;
        case -1:
            Sauces.findOneAndUpdate(
                { _id: req.params.id },
                { $inc: { dislikes: +1 }, $push: { usersDisliked: req.body.userId } },
                // { useFindAndModify: false }
            )
                .then(() => res.status(200).json({ message: "Dislike ajouté"}))
                .catch(error => res.status(400).json({ error }))
        break;
    }
    

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