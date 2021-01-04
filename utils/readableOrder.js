const {mapNumToMana} = require('./mapManaToNum');

const readableOrdr = (order) => {
    const name = order.username.toString();
    const product = mapNumToMana(order.foodnumber);
    const time = order.date.toString();

    return `${name} ordered ${product} in ${time}`;
}

module.exports = {
    readableOrdr
}