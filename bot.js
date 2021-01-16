const {adminIDs, botToken, isTeleLogActivate, teleLogAdminId} = require('./config');
const TeleBot = require('telebot');
const request = require('request');
const bot = new TeleBot(botToken);
const constants = require('./constants');
const math = require('mathjs');
const db = require('./db');

//user commands
{

// Listens for the invocation of /start command
    bot.on('/start', (msg) => {
        // Sends welcome message to chat.
        console.log("user started conversation with the bot");
        return bot.sendMessage(msg.chat.id, `Welcome ${msg.from.first_name}! Type /help to learn more about how this bot works.`);
    });

    /*
    bot.on('/get_logs', (msg) => {
        console.log("1");
        db.getLogs(false, (res) => {
            console.log(res);
            var text = "User: " +  res[0].user.name + " text: " + res[0].message.text;
            bot.sendMessage(msg.chat.id, text);
        })
    });*/

    bot.on('/compliment', (msg) => {
        const INSULT_PROBABILITY = 0.6
        // Returns a floating value between 0 and 1
        const insultOrCompliment = Math.random();
        if (insultOrCompliment > INSULT_PROBABILITY) {
            // Insult
            const randPick = Math.floor(Math.random() * constants.insultsList.length);
            let text = constants.insultsList[randPick];
            return bot.sendMessage(msg.chat.id, `${msg.from.first_name}, ${text}`);
        } else {
            // Compliment
            request('https://complimentr.com/api', {json: true}, function (error, response, body) {
                let text;
                if (!error && response.statusCode == 200) {
                    text = body.compliment;
                } else {
                    text = "I'm not in the mood to compliment you.";
                    console.log("error");
                }
                return bot.sendMessage(msg.chat.id, `${msg.from.first_name}, ${text}.`);
            });
        }
    });

    bot.on('/help', (msg) => {
        var text =
            `The available commands for this game are:

To register as a TRIBUTE, type:
/register (and follow the prompts)

To KILL someone, type:
/kill (and follow the prompts)

To STICK someone, type:
/stick (and follow the prompts)

To DIE, type:
/dead (and follow the prompts)

To view ALL tributes, type:
/tributes

Please start a conversation with @ashansins7_bot first if you have not done so :)`
        // "The available commands for this game are:\n\n"
        // + "To register as a TRIBUTE, type:\n"
        // + "/register (and follow the prompts)\n\n"
        // + "To KILL someone, type:\n"
        // + "/kill (and follow the prompts)\n\n"
        // + "To STICK someone, type:\n"
        // + "/stick (and follow the prompts)\n\n"
        // + "To DIE, type:\n"
        // + "/dead (and follow the prompts)\n\n"
        // + "To view ALL tributes, type:\n"
        // + "/tributes all\n\n"
        // + "To view tributes from a SPECIFIC SIDE OF THE REBELLION type:\n"
        // + "/tributes <District>\n"
        // + "Where <District> is either resistance or capitol.\n\n"
        // + "This feature however, requires you to start a conversation with @ashansins6_bot first :)";
        return bot.sendMessage(msg.chat.id, text);
    });

    bot.on([/^\/register$/, /^\/register@Ashansins_bot$/], (msg) => {
        return db.prekds(bot, msg, "register", "To which District do you pledge your allegiance?");
    });
    bot.on(/^\/register (.+)$/, (msg, props) => {
        const text = props.match[1].toLowerCase();
        return db.processRegistration(msg, text, (message) => {
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
    bot.on([/^\/kill$/, /^\/kill@Ashansins_bot$/], (msg) => {
        return db.prekds(bot, msg, "prekill", "From which District is your target to kill?");
    });

    bot.on([/^\/dead$/, /^\/dead@Ashansins_bot$/], (msg) => {
        return db.prekds(bot, msg, "predead", "From which District is your killer?");
    });

    bot.on([/^\/stick$/, /^\/stick@Ashansins_bot$/], (msg) => {
        return db.prekds(bot, msg, "prestick", "From which District is your target to stick?");
    });

    /*
    not used for ashansins 6 as ashansins 6 is not points based

    bot.on([/^\/☠️$/, /^\/☠️@Ashansins_bot$/], (msg) => {
        return db.sendExterminatorScore(msg, (message) => {
            return bot.sendMessage(msg.chat.id, message);
        });
    });
    */

    bot.on([/^\/tributes$/, /^\/tributes@Ashansins_bot$/], (msg) => {
        db.displayAllTributes((message) => {
            return bot.sendMessage(msg.chat.id, message, {parseMode: "HTML"});
        });
    });
    bot.on(/^\/tributes (.+)$/, (msg, props) => {
        const text = props.match[1].toLowerCase();
        console.log(text);
        if (text === "all" || text === "/tributes all") {
            db.displayAllTributes((message) => {
                return bot.sendMessage(msg.chat.id, message, {parseMode: "HTML"});
            })
        } else if (text === "resistance" || text === "/tributes resistance") {
            db.displayTributes("resistance", (message) => {
                return bot.sendMessage(msg.chat.id, message, {parseMode: "HTML"});
            })
        } else if (text === "capitol" || text === "/tributes capitol") {
            db.displayTributes("capitol", (message) => {
                return bot.sendMessage(msg.chat.id, message, {parseMode: "HTML"});
            })
        } else if (text === "spec" || text === "/tributes spec") {
            db.displayTributes("spec", (message) => {
                return bot.sendMessage(msg.chat.id, message, {parseMode: "HTML"});
            })
        } else if (text === "🔪" || text === "/tributes 🔪") {
            db.displayTributes("🔪", (message) => {
                return bot.sendMessage(msg.chat.id, message, {parseMode: "HTML"});
            })
        } else {
            return bot.sendMessage(msg.chat.id, "Sorry, invalid command.\n\nTo view ALL tributes, type:\n/tributes all\n\nTo view tributes from a SPECIFIC side of the rebellion, type:\n/tributes <District>\nWhere <District> is either resistance or capitol.\n")
        }
    });

    bot.on([/^\/Targets$/, /^\/Targets@Ashansins_bot$/], (msg) => {
        db.sendExterminatorTargets((message) => {
            return bot.sendMessage(msg.chat.id, message, {parseMode: "HTML"});
        });
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

    // bot.on(/^\/🔪Equip (.+)$/, (msg, props) => {
    //     const text = props.match[1];
    //     var processed = extractLast(text);
    //     console.log(processed);
    //     if (processed[1] === "Coin" || processed[1] === "2Coin" || processed[1] === "3Coin" || processed[1] === "Remove") {
    //         db.updateEquip(false, processed[0], processed[1], function (user, message) {
    //             bot.sendMessage(user.user.id, message);
    //         });
    //     } else {
    //         return bot.sendMessage(msg.from.id, "Please give valid inputs!");
    //     }
    // });
}

//admin commands
{
    bot.on(/^\/say (.+)$/, (msg, props) => {
        // console.log(msg);
        // console.log(props);
        const text = props.match[1];
        return bot.sendMessage(msg.from.id, text, {replyToMessage: msg.message_id});
    });

    bot.on([/^\/random$/, /^\/random@Ashansins_bot$/], (msg) => {
        return db.prekds(bot, msg, "random", "From which District do you want to select a random tribute?");
    });

    bot.on('/sudoTest', msg => {
        console.log("entered sudoTest");
        return bot.sendMessage(msg.chat.id, msg.chat.id, {parseMode: "HTML"});
    });

    bot.on('/clear_logs', (msg) => {
        if(!validateAdmin(msg.from.id)){
            return;
        }
        db.clearLogs(false, (res) => console.log("Clearing the logs!"));
    });

    bot.on(/^\/Revive (.+)$/, (msg, props) => {
        if(!validateAdmin(msg.from.id)){
            return;
        }
        const text = props.match[1];
        db.reviveTribute(false, text, function (user) {
            bot.sendMessage(user.user.id, "You got revived!");
        }, function (id, message) {
            bot.sendMessage(id, message);
        });
        return bot.sendMessage(msg.from.id, "Successful Revive!");
    });

    bot.on(/^\/SendToAll (.+)$/, (msg, props) => {
        if(!validateAdmin(msg.from.id)){
            return;
        }
        const text = props.match[1];
        return db.sendToAll(text, (chat_id, message) => {
            return bot.sendMessage(chat_id, message);
        });
    });

    bot.on(/^\/SendTo (.+)$/, (msg, props) => {
        if(!validateAdmin(msg.from.id)){
            return;
        }
        const text = props.match[1];
        console.log(text);

        var processed = extractFirst(text);
        return db.sendTo(processed[0], processed[1], msg, (chat_id, message) => {
            return bot.sendMessage(chat_id, message);
        });
    });

    bot.on(/^\/Unregister (.+)$/, (msg, props) => {
        if(!validateAdmin(msg.from.id)){
            return;
        }
        const userName = props.match[1]
        console.log("Attempting to unregister " + userName);
        return db.processUnregistration(msg, userName, (message) => {
            return bot.sendMessage(msg.chat.id, message);
        });
    });

    /**
     * Returns true IFF userId is an admin
     * @param userId
     * @returns true IFF userId is an admin
     */
    function isAdmin(userId) {
        return adminIDs.includes(userId);
    }

    /**
     * Checks if userId is an admin. If they are not, sends an error message to the user.
     * @param userId
     * @returns true IFF userId is an admin
     */
    function validateAdmin(userId) {
        if (isAdmin(userId)) {
            return true;
        } else {
            bot.sendMessage(userId, "Error: you are not authorized to use this command");
            return false;
        }
    }
}

/*bot.on(/^\/🔪RandomRevive (.+)$/, (msg, props) => {
    const text = props.match[1];
    db.randomRevive(text, function(user) {
        bot.sendMessage(user.user.id, "You got revived!")
    }, function(id, message) {
        bot.sendMessage(id, message);
    });
    return bot.sendMessage(msg.from.id, "Successful " + text + " Revive!");
});*/

/*bot.on(/^\/🔪ReviveAll (.+)$/, (msg, props) => {
    const text = props.match[1];
    db.reviveAll(function(user) {
        bot.sendMessage(user.user.id, "You got revived!")
    }, function(id, message) {
        bot.sendMessage(id, message);
    });
    return bot.sendMessage(msg.from.id, "Successful " + text + " Revive!");
});*/

if (isTeleLogActivate) {
    bot.on(/^(.+)$/, (msg, props) => {
        db.addLog(false, {
            name: msg.from.first_name,
            id: msg.from.id
        }, {
            chat_id: msg.chat.id,
            id: msg.message_id,
            text: props.match[1]
        })

        bot.sendMessage(teleLogAdminId, msg.from.first_name + "(" + msg.from.id + "): " + props.match[0]);
    });
}

// Inline button callback
bot.on('callbackQuery', msg => {
    // User message alert
    // console.log("in callback");
    // console.log(msg);

    bot.answerCallbackQuery(msg.id, `Inline button callback: ${msg.data}`, true);

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
        reply += operands[Math.floor(Math.random() * operands.length)];
        reply += Math.floor(Math.random() * 100);
    }

    var answer = math.eval(reply);

    reply += " = " + answer;
    bot.sendMessage(msg.chat.id, reply);
});

/*
bot.on('/spy', (msg) => {
    var messages = ["%s, you are the spy.",
        "Nice try, %s, but that won't work.",
        "I am the spy.",
        "Maybe it's you? Maybe it's me? Maybe it's all of us.",
        ];
    var reply = messages[Math.floor(Math.random()*messages.length)];
    reply = reply.replace('%s', msg.from.first_name);

    bot.sendMessage(msg.chat.id, reply);
});*/

bot.start();