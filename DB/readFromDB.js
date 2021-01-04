const Order  = require('./models/order');
const {generateDate} = require('../utils/getTheDate');

async function getOrders(isAdmin, userid) {
    try {
        var orders = isAdmin ? 
        orders = await Order.find({
        }) :
        orders = await Order.find({
            user_id : userid
        })
        return orders;

    } catch (e) {
        console.log('Problem with getting data: ' + e);
    }
}

async function userOrderedToday(userid) {
    const today = generateDate();
    // Get orders from a spesific user from today
    try {
        const orders = await Order.find({
            user_id : userid,
            date: today
        })
        return orders.length !== 0;
    } catch (e) {
        console.log('Problem with getting data from checkIfUserOrdered: ' + e);
    }
}

module.exports = {
    getOrders,
    userOrderedToday
}