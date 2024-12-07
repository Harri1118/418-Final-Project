const mongoose = require("mongoose");

const FavoritedFileSchema = new mongoose.Schema({
    file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PublicFile"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})
const FavoritedFile = mongoose.model("FavoriteFile", FavoritedFileSchema)
module.exports = FavoritedFile;