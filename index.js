require('./DB/mongoose');
const {createOrder} = require('./DB/createOrder')
const {generateDate} = require('./utils/getTheDate');
const {readableOrdr} = require('./utils/readableOrder');
const {mapManaToNum} = require('./utils/mapManaToNum');
const {getOrders, userOrderedToday} = require('./DB/readFromDB');
const TelegramBot = require('node-telegram-bot-api');

// tokens and costants
// const token = 'insert the right token before running the bot';
const Admin_id = '476494953';
const bot = new TelegramBot(token, {polling: true});
// Main menue
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Hi! what do you want to do?", {
    "reply_markup": {
        "keyboard": [["Make an order!"], ["See the orders"]]
        }
    });
});

bot.on('message', (msg) => {

    // Make an order!
    if (msg.text.toString() === "Make an order!") {
        bot.sendMessage(msg.chat.id, "Please choose order from the the menue:", {
            "reply_markup": {
                "keyboard": [["Make an order!", "See the orders", "Exit"], ["pizza"], ["toast"], ["fallafel"]]
                }
        });
    }

    // Order pizza/toast/fallafel
    if (["pizza", "toast", "fallafel"].includes(msg.text.toString()))  {
            const manaNum = mapManaToNum(msg.text.toString());
            const username = `${msg.chat.first_name.toString()} ${msg.chat.last_name.toString()}`;
            const userid = msg.from.id;
            const dateOrder = generateDate();  
        userOrderedToday(userid).then(alreadyOrdered => {
            if (alreadyOrdered) {
                bot.sendMessage(userid, "<b>Sorry.. one order per day!</b>", {parse_mode : "HTML"});
            } else {
                createOrder(manaNum, username, userid, dateOrder);
                bot.sendMessage(userid, "<b>We saved your order!</b>", {parse_mode : "HTML"});
            }
        })
    }

    // See the orders
    if (msg.text.toString() === "See the orders") {
        const userid = msg.from.id.toString();
        // Check if user is Admin
        const isAdmin = userid === Admin_id
        // activate async function to fetch data from DB
        getOrders(isAdmin, userid).then(orders => {
            if (orders.length === 0) {
                bot.sendMessage(msg.chat.id, "<b>It looks like you have no orders yet..</b>", {parse_mode : "HTML"})
            } else {
                orders.forEach((order) => {
                    const r = readableOrdr(order);
                    bot.sendMessage(msg.chat.id, r);
                })
            }
        }) 
    }

    // Exit from menue
    if (msg.text.toString() === "Exit") {
        bot.sendMessage(msg.chat.id, "BYE BYE!", {
            "reply_markup": {
                "keyboard": [["Make an order!"], ["See the orders"]]
                }
        });  
    }
});