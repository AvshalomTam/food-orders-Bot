const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    foodnumber: {
        type: Number
    },
    username: {
        type: String
    },
    user_id: {
        type: Number
    },
    date: {
        type: String
    }
});

const Order = mongoose.model('Order', userSchema);

module.exports = Order;