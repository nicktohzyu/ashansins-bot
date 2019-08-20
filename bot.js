// your token from BotFather
var botToken = '969817030:AAFSDOyJzpDk9X1tT4zRkLbWaSAlox8bkUk'; 
const TeleBot = require('telebot');
const bot = new TeleBot(botToken);
const math = require('mathjs');
var db = require('./db');
const heman_id = 31031122;
const johanna_id = 650290297;

var adminIDs = [heman_id, johanna_id];

bot.on(/^\/say (.+)$/, (msg, props) => {
    console.log(msg);
    console.log(props);
    const text = props.match[1];
    return bot.sendMessage(msg.from.id, text, { replyToMessage: msg.message_id });
});

bot.on('/get_logs', (msg) => {
    console.log("1");
    db.getLogs(false, (res) => {console.log(res);
        var text = "User: " +  res[0].user.name + " text: " + res[0].message.text;
        bot.sendMessage(msg.chat.id, text);
    })
});

bot.on('/clear_logs', (msg) => {
    db.clearLogs(false, (res) => console.log("Clearing the logs!"));
})

bot.on('/help', (msg) => {
    var text = "The available commands for this game are:\n\n"
        + "To register as a TRIBUTE, type:\n"
        + "/register <District>\n"
        + "Where <District> is either 1, 2, 6 or 12.\n"
        + "E.g. If you belong to district 2, type:\n"
        + "/register 2\n\n"
        + "To KILL someone, type:\n"
        + "/kill <Tribute's FIRST name> (CASE SENSITIVE)\n"
        + "E.g. If Bridget's first name was registered as Brids, type:\n"
        + "/kill Brids\n\n"
        + "To STICK someone, type:\n"
        + "/stick <Tribute's FIRST name>\n\n"
        + "To DIE, type:\n"
        + "/dead <Your killer's FIRST name>\n\n"
        + "To view ALL tributes, type:\n"
        + "/tributes all\n\n"
        + "To view tributes from a SPECIFIC DISTRICT, type:\n"
        + "/tributes <District>\n"
        + "Where <District> is either 1, 2, 6 or 12.\n\n"
        + "Typing /kill, /stick or /dead without any tribute indicated will cause the bot to prompt to ask who is your target.\n"
        + "This feature however, requires you to start a conversation with @ashansins6_bot first.";
    return bot.sendMessage(msg.chat.id, text);
})

bot.on(/^\/tributes (.+)$/, (msg, props) => {
    const text = props.match[1].toLowerCase();
    console.log(text);
    if (text === "all" || text === "/tributes all") {
        db.displayAllPlayers((message) => {
        return bot.sendMessage(msg.chat.id, message, {parseMode:"HTML"});
        });
    } else if (text === "district1" || text === "/tributes district1") {
        db.displayPlayers("district1", (message) => {
            return bot.sendMessage(msg.chat.id, message, {parseMode:"HTML"});
        })
    } else if (text === "district2" || text === "/tributes district2") {
        db.displayPlayers("district2", (message) => {
            return bot.sendMessage(msg.chat.id, message, {parseMode:"HTML"});
        })
    } else if (text === "district6" || text === "/tributes district6") {
        db.displayPlayers("district6", (message) => {
            return bot.sendMessage(msg.chat.id, message, {parseMode:"HTML"});
        })
    } else if (text === "district12" || text === "/tributes district12") {
        db.displayPlayers("district12", (message) => {
            return bot.sendMessage(msg.chat.id, message, {parseMode:"HTML"});
        })
    } else if (text === "spec" || text === "/tributes spec") {
        db.displayPlayers("spec", (message) => {
            return bot.sendMessage(msg.chat.id, message, {parseMode:"HTML"});
        })
    } else if (text === "🔪" || text === "/tributes 🔪") {
        db.displayPlayers("🔪", (message) => {
            return bot.sendMessage(msg.chat.id, message, {parseMode:"HTML"});
        })
    } else {
        return bot.sendMessage(msg.chat.id, "Sorry, invalid command.\n\nTo view ALL players, type:\n/tributes all\n\nTo view players from a SPECIFIC NATION, type:\n/tributes <District>\nWhere <District> is either district1, district2, district6 or district12.\n")
    }
});


bot.on(/^(.+)$/, (msg, props) => {
    db.addLog(false, {
        name: msg.from.first_name,
        id: msg.from.id
    }, {
        chat_id: msg.chat.id, 
        id: msg.message_id,
        text: props.match[1]
    })

    bot.sendMessage(johanna_id, msg.from.first_name + "(" + msg.from.id + "): " + props.match[0]);
});

bot.on(/^\/register (.+)$/, (msg, props) => {
    const text = props.match[1].toLowerCase();
    return db.processRegistration(msg, text, (message) => {
        return bot.sendMessage(msg.chat.id, message);
    });
});

bot.on(/^\/🔪Unregister (.+)$/, (msg, props) => {
    const user = props.match[1]
    console.log(user);
    return db.processUnregistration(msg, user, (message) => {
        return bot.sendMessage(msg.chat.id, message);
    });
});


bot.on(/^\/kill (.+)$/, (msg, props) => {
    const text = props.match[1];
    console.log("KILLING");
    return db.processKill(msg, text, (id, message) => {
        return bot.sendMessage(id, message);
    });
}); 

bot.on([/^\/☠️$/, /^\/☠️@Ashansins_bot$/], (msg) => {
    return db.sendExterminatorScore(msg, (message) => {
        return bot.sendMessage(msg.chat.id, message);
    });
});

bot.on([/^\/☠️Targets$/, /^\/☠️Targets@Ashansins_bot$/], (msg) => {
    db.sendExterminatorTargets((message) => {
        return bot.sendMessage(msg.chat.id, message, {parseMode:"HTML"});
    });
});
bot.on([/^\/kill$/, /^\/kill@Ashansins_bot$/], (msg) => {
    return db.prekds(bot, msg, "prekill", "From which District is your target to kill?");
});

bot.on([/^\/dead$/, /^\/dead@Ashansins_bot$/], (msg) => {
    return db.prekds(bot, msg, "predead", "From which District is your killer?");
});

bot.on([/^\/stick$/, /^\/stick@Ashansins_bot$/], (msg) => {
    return db.prekds(bot, msg, "prestick", "From which District is your target to stick?");
});

bot.on([/^\/random$/, /^\/random@Ashansins_bot$/], (msg) => {
    return db.prekds(bot, msg, "random", "From which District do you want to select a random player?");
});

bot.on([/^\/register$/, /^\/register@Ashansins_bot$/], (msg) => {
    return db.prekds(bot, msg, "register", "To which District do you pledge your allegiance?");
});

bot.on([/^\/tributes$/, /^\/tributes@Ashansins_bot$/], (msg) => {
    db.displayAllPlayers((message) => {
        return bot.sendMessage(msg.chat.id, message, {parseMode:"HTML"});
        });
});

// Inline button callback
bot.on('callbackQuery', msg => {
    // User message alert
    console.log("reached");
    console.log(msg);

    bot.answerCallbackQuery(msg.id, `Inline button callback: ${ msg.data }`, true);

    console.log(msg.data);
    var data = JSON.parse(msg.data);
    console.log(data);
    if (data.purpose == "kill") {
        console.log("killing: " + data.target);
        return db.processKill(msg, data.target, (id, message) => {
            return bot.sendMessage(id, message);
        });
    } else if (data.purpose == "dead") {
        console.log("deading: " + data.target);
        return db.processDead(msg, data.target, (id, message) => {
            return bot.sendMessage(id, message);
        });
    } else if (data.purpose == "stick") {
        console.log("sticking: " + data.target);
        return db.processStick(msg, data.target,
            (id, message) => {
                return bot.sendMessage(id, message);
            }, (message) => {
                pingAdmins(bot, message);
            });
    } else if (data.purpose == "prekill") {
        return db.kill(bot, msg, data.target);
    } else if (data.purpose == "predead") {
        return db.dead(bot, msg, data.target);
    } else if (data.purpose == "prestick") {
        return db.stick(bot, msg, data.target);
    } else if (data.purpose == "random") {
        return db.rollDistrict(bot, msg, data.target);
    } else if (data.purpose == "register") {
        return db.processRegistration(msg, data.target.toLowerCase(), (message) => {
            return bot.sendMessage(msg.from.id, message);
        });
    }

});

bot.on(/^\/dead (.+)$/, (msg, props) => {
    const text = props.match[1];
    return db.processDead(msg, text, (id, message) => {
        return bot.sendMessage(id, message);
    });
});

bot.on(/^\/stick (.+)$/, (msg, props) => {
    const text = props.match[1];
    return db.processStick(msg, text,
        (id, message) => {
            return bot.sendMessage(id, message);
        }, (message) => {
            pingAdmins(bot, message);
        });
});

bot.on(/^\/🔪Equip (.+)$/, (msg, props) => {
    const text = props.match[1];
    var processed = extractLast(text);
    console.log(processed);
    if (processed[1] === "Coin" || processed[1] === "2Coin" || processed[1] === "3Coin" || processed[1] === "Remove") {
        db.updateEquip(false, processed[0], processed[1], function(user, message) {
            bot.sendMessage(user.user.id, message);
        });
    } else {
        return bot.sendMessage(msg.from.id, "Please give valid inputs!");
    }
});

bot.on(/^\/🔪Revive (.+)$/, (msg, props) => {
    const text = props.match[1];
    db.revivePlayer(false, text, function(user) {
        bot.sendMessage(user.user.id, "You got revived!");
    }, function (id, message) {
        bot.sendMessage(id, message);
    });
    return bot.sendMessage(msg.from.id, "Successful Revive!");
});

bot.on(/^\/🔪SendToAll (.+)$/, (msg, props) => {
    const text = props.match[1];
    return db.sendToAll(text, (chat_id, message) => {
        return bot.sendMessage(chat_id, message);
    });
});

bot.on(/^\/🔪SendTo (.+)$/, (msg, props) => {
    const text = props.match[1];
    console.log(text);


    var processed = extractFirst(text);
    return db.sendTo(processed[0], processed[1], msg, (chat_id, message) => {
        return bot.sendMessage(chat_id, message);
    });
});

bot.on(/^\/🔪RandomRevive (.+)$/, (msg, props) => {
    const text = props.match[1];
    db.randomRevive(text, function(user) {
        bot.sendMessage(user.user.id, "You got revived!")
    }, function(id, message) {
        bot.sendMessage(id, message);
    });
    return bot.sendMessage(msg.from.id, "Successful " + text + " Revive!");
});

bot.on(/^\/🔪ReviveAll (.+)$/, (msg, props) => {
    const text = props.match[1];
    db.reviveAll(function(user) {
        bot.sendMessage(user.user.id, "You got revived!")
    }, function(id, message) {
        bot.sendMessage(id, message);
    });
    return bot.sendMessage(msg.from.id, "Successful " + text + " Revive!");
});

function extractFirst(input) {
    var inputArray = input.split(" ");
    console.log(inputArray);
    var remainder = "";
    for (var i = 1; i < inputArray.length; i++) {
        remainder += inputArray[i] + " ";
    }
    return [inputArray[0], remainder];
}

function extractLast(input) {
    var inputArray = input.split(" ");
    var remaining = inputArray[0];

    for (var i = 1; i < inputArray.length - 1; i++) {
        remaining += " " + inputArray[i];
    }
    return [remaining, inputArray[inputArray.length - 1]];
}

function pingAdmins(bot, message) {
    for (var i in adminIDs) {
        bot.sendMessage(adminIDs[i], message);
    }
}

bot.on('/generate_equations', (msg) => {
    var operands = [" + ", " - ", " * ", " / "];
    var reply = Math.floor(Math.random() * 100);
    for (var i = 0; i < 5; i++) {
        reply += operands[Math.floor(Math.random()*operands.length)];
        reply += Math.floor(Math.random() * 100);
    }

    var answer = math.eval(reply);

    reply += " = " + answer;
    bot.sendMessage(msg.chat.id, reply);
});

bot.on('/mole', (msg) => {
    var messages = ["%s, you are the mole.",
    "Nice try, %s, but that won't work.",
    "I am the mole.",
    "Maybe it's you? Maybe it's me? Maybe it's all of us.",
    "我是警察。"];
    var reply = messages[Math.floor(Math.random()*messages.length)];
    reply = reply.replace('%s', msg.from.first_name);

    bot.sendMessage(msg.chat.id, reply);
});

bot.start();