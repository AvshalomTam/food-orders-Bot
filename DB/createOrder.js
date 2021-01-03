const Order  = require('./models/order');

const createOrder = (foodnumber=0, username='', user_id=0, date=0) => {
    const order = new Order({
        foodnumber,
        username,
        user_id,
        date
    })
    
    order.save().then(() => {
    }).catch((error) => {
        console.log('error!', error)
    })
}

module.exports = {
    createOrder
}