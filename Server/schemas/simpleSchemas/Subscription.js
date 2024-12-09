const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    price: {type: Number}
});
const Subscription = mongoose.model("Subscription", SubscriptionSchema);
module.exports = Subscription;