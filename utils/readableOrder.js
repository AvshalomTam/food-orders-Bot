const {mapManaToNum, mapNumToMana} = require('./mapManaToNum');
const readableOrdr = (order) => {
    // console.log(order.user_id.toString());
    const name = order.username.toString();
    const product = mapNumToMana(order.foodnumber);
    const time = order.date.toString();
    
    // const time = new Date(order.date).toString();
    return `${name} ordered ${product} in ${time}`;
}

module.exports = {
    readableOrdr
}