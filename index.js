require('./DB/mongoose');
const {createOrder} = require('./DB/createOrder')
const {generateDate} = require('./utils/getTheDate');
const {readableOrdr} = require('./utils/readableOrder');
const {mapManaToNum, mapNumToMana} = require('./utils/mapManaToNum');
const TelegramBot = require('node-telegram-bot-api');
const Order = require('./DB/models/order');

// tokens and costants
const token = '1427121784:AAEgBKh9mZ5eXV4c7wMNG61BJYb7MZcN_-A';
const Admin_id = '476494953';
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg) => {
    
    bot.sendMessage(msg.chat.id, "Hi! what do you want to do?", {
    "reply_markup": {
        "keyboard": [["Make an order!"], ["See the orders"]]
        }
    });
});
bot.on('message', (msg) => {
    // Make an order!
    var makeOrder = "Make an order!";
    if (msg.text.toString() === makeOrder) {
        bot.sendMessage(msg.chat.id, "Please choose order from the the menue:", {
            "reply_markup": {
                "keyboard": [["Make an order!", "See the orders", "Exit"], ["pizza"], ["toast"], ["fallafel"]]
                }
        });
    }
    if ((msg.text.toString().toLowerCase().indexOf("pizza") === 0) ||
        (msg.text.toString().toLowerCase().indexOf("toast") === 0) ||
        (msg.text.toString().toLowerCase().indexOf("fallafel") === 0))  {
            const manaNum = mapManaToNum(msg.text.toString());
            const username = `${msg.chat.first_name.toString()} ${msg.chat.last_name.toString()}`;
            const userid = msg.from.id;
            const dateOrder = generateDate();
            
        const orderInfo = {
            manaNum,
            username,
            userid,
            dateOrder
        }
        // check if user already ordered in that day
        checkIfUserOrdered(orderInfo, bot, msg.chat.id)
    }

    // See the orders
    var seeOrders = "See the orders";
    if (msg.text.toString() === seeOrders) {
        // const madeOrderToday = false;
        const userid = msg.from.id;
        // Check if user is Admin
        if (userid.toString() === Admin_id) {
            const od = getOrders(true, userid, msg, bot);
        } else {
            const od = getOrders(false, userid, msg, bot);
        }
    }

    var exit = "Exit";
    if (msg.text.toString() === exit) {
        bot.sendMessage(msg.chat.id, "BYE BYE!", {
            "reply_markup": {
                "keyboard": [["Make an order!"], ["See the orders"]]
                }
        });
        
    }
});

async function getOrders(isAdmin, userid, msg, bot) {
    try {
        var orders = []
        if (isAdmin) {
            orders = await Order.find({
            })
        } else {
            orders = await Order.find({
                user_id : userid
            })
        }

        if (orders.length === 0) {
            bot.sendMessage(msg.chat.id, "<b>It looks like you have no orders yet..</b>", {parse_mode : "HTML"})
        } else {
            orders.forEach((order) => {
                const r = readableOrdr(order);
                bot.sendMessage(msg.chat.id, r);
            })
        }

    } catch (e) {
        console.log('Problem with getting data: ' + e);
    }
}

async function checkIfUserOrdered(orderInfo, bot, msgId) {
    const today = generateDate()
    try {
        const orders = await Order.find({
            user_id : orderInfo.userid
        })
        orders.filter((order) => {return order.date.toString() === today})
        // no other orders from today
        if (orders.length === 0) {
            createOrder(orderInfo.manaNum, orderInfo.username, orderInfo.userid, orderInfo.dateOrder);
            bot.sendMessage(msgId, "<b>We saved your order!</b>", {parse_mode : "HTML"});
        } else {
            bot.sendMessage(msgId, "<b>Sorry.. one order per day!</b>", {parse_mode : "HTML"});
        }

    } catch (e) {
        console.log('Problem with getting data from checkIfUserOrdered: ' + e);
    }
}