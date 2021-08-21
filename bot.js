const {adminIDs, botToken, isTeleLogActivate, teleLogAdminId, HELP_MSG, VALIDATE_DIRECT_MESSAGE} = require('./config');
const TeleBot = require('telebot');
const request = require('request');
const bot = new TeleBot(botToken);
const constants = require('./constants');
// const math = require('mathjs');
const db = require('./db');

/**
 * Checks if the message was sent directly to the bot, and not in a group.
 * If it was not a direct message, sends an error message to the user and returns false
 * @param msg
 * @returns true IFF the messsage was sent directly
 */
function validateDm(msg) {
    if (msg.from.id !== msg.chat.id) {
        bot.sendMessage(msg.chat.id, VALIDATE_DIRECT_MESSAGE, { replyToMessage: msg.message_id });
        return false
    } else {
        return true;
    }
}

//user commands
{

// Listens for the invocation of /start command
    bot.on('/start', (msg) => {
        // Sends welcome message to chat.
        console.log(msg.from.username + " started conversation with the bot");
        return bot.sendMessage(msg.from.id, `Welcome ${msg.from.first_name}! Use /help to learn more about how this bot works.`);
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
                    console.log("Error with complimenting");
                }
                return bot.sendMessage(msg.chat.id, `${msg.from.first_name}, ${text}.`);
            });
        }
    });

    bot.on('/help', (msg) => {
        return bot.sendMessage(msg.chat.id, HELP_MSG, { webPreview: false });
    });

    bot.on('/register', (msg) => {

        const fs = require('fs');
        fs.readFile('./teamlist.json', 'utf8', (error, jsonString) => {
            if (error) {
                console.log("Error reading JSON file:", error);
                return;
            }
            try {
                const teamlist = JSON.parse(jsonString);
                const username = msg.from.username;
                const team = teamlist[username.toLowerCase()];
                console.log(msg.from.id);
                
                if (!validateDm(msg)) {
                    return;
                }

                return team 
                    ? db.processRegistration(msg, team, (message) => {
                        return bot.sendMessage(msg.from.id, message);
                    })
                    : bot.sendMessage(msg.chat.id, "You don't seem to have signed up for Ashanshins! Please contact the Ashanshins game masters for assistance.");

            } finally {}
        });
    });
    // bot.on(/^\/register (.+)$/, (msg, props) => {
    //     const text = props.match[1].toLowerCase();
    //     return db.processRegistration(msg, text, (message) => {
    //         return bot.sendMessage(msg.chat.id, message);
    //     });
    // });

    // bot.on(/^\/kill (.+)$/, (msg, props) => {
    //     const text = props.match[1];
    //     console.log("KILLING");
    //     return db.processKill(msg, text, (id, message) => {
    //         return bot.sendMessage(id, message);
    //     });
    // });
    bot.on('/kill', (msg) => {
        //TODO: add warning that victims must register death first
        if (!validateDm(msg)) {
            return;
        }
        //TODO: only show unclaimed dead victims
        return db.selectTeamDialog(bot, msg, "killVictim", "From which Team is your target to kill?");
    });

    bot.on('/dead', (msg) => {
        if (!validateDm(msg)) {
            return;
        }
        return db.selectTeamDialog(bot, msg, "predead", "From which Team is your killer?");
    });

    // bot.on([/^\/stick$/, /^\/stick@Ashansins_bot$/], (msg) => {
    //     return db.selectTeamDialog(bot, msg, "prestick", "From which Team is your target to stick?");
    // });

    /*
    not used for ashansins 6 as ashansins 6 is not points based

    bot.on([/^\/☠️$/, /^\/☠️@Ashansins_bot$/], (msg) => {
        return db.sendExterminatorScore(msg, (message) => {
            return bot.sendMessage(msg.chat.id, message);
        });
    });
    */

    bot.on('/players', (msg) => {
        db.displayAllPlayers((message) => {
            return bot.sendMessage(msg.chat.id, message, {parseMode: "HTML"});
        });
    });

    bot.on('/targets', (msg) => {
        db.sendExterminatorTargets((message) => {
            return bot.sendMessage(msg.chat.id, message, {parseMode: "HTML"});
        });
    });

    // bot.on(/^\/dead (.+)$/, (msg, props) => {
    //     const text = props.match[1];
    //     return db.processDead(msg, text, (id, message) => {
    //         return bot.sendMessage(id, message);
    //     });
    // });

    // bot.on(/^\/stick (.+)$/, (msg, props) => {
    //     const text = props.match[1];
    //     return db.processStick(msg, text,
    //         (id, message) => {
    //             return bot.sendMessage(id, message);
    //         }, (message) => {
    //             pingAdmins(bot, message);
    //         });
    // });

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
    bot.on(/^\/Echo (.+)$/, (msg, props) => {
        if (!validateAdmin(msg.from.id)) {
            return;
        }
        // console.log(msg);
        // console.log(props);
        const text = props.match[1];
        return bot.sendMessage(msg.from.id, text, {replyToMessage: msg.message_id});
    });

    bot.on('/Random', (msg) => {
        //TODO: only selects dead players. Purpose? Should this be split to /RandomDead?
        if (!validateAdmin(msg.from.id)) {
            return;
        }
        return db.selectTeamDialog(bot, msg, "random", "From which Team do you want to select a random player?");
    });

    bot.on('/SudoTest', msg => {
        if (!validateAdmin(msg.from.id)) {
            return;
        }
        console.log("entered sudoTest");
        return bot.sendMessage(msg.chat.id, msg.chat.id, {parseMode: "HTML"});
    });

    bot.on('/Clear_logs', (msg) => {
        if (!validateAdmin(msg.from.id)) {
            return;
        }
        db.clearLogs(false, (res) => console.log("Clearing the logs!"));
    });

    bot.on(/^\/Revive (.+)$/, (msg, props) => {
        if (!validateAdmin(msg.from.id)) {
            return;
        }
        const text = props.match[1];
        db.revivePlayer(false, bot, text, function (user) {
            bot.sendMessage(user.user.id, "You got revived!");
        });
        return bot.sendMessage(msg.from.id, "Successful Revive!");
    });

    bot.on(/^\/SendToAll (.+)$/, (msg, props) => {
        if (!validateAdmin(msg.from.id)) {
            return;
        }
        const text = props.match[1];
        return db.sendToAll(bot, text);
    });

    bot.on(/^\/SendToGroups (.+)$/, (msg, props) => {
        if (!validateAdmin(msg.from.id)) {
            return;
        }
        const text = props.match[1];
        return db.notifyGroupChats(bot, text);
    });

    bot.on(/^\/SendTo (.+)$/, (msg, props) => {
        if (!validateAdmin(msg.from.id)) {
            return;
        }
        const text = props.match[1];
        // console.log(text);

        var processed = extractFirst(text);
        return db.sendTo(processed[0], processed[1], msg, (chat_id, message) => {
            return bot.sendMessage(chat_id, message);
        });
    });

    bot.on(/^\/Unregister (.+)$/, (msg, props) => {
        if (!validateAdmin(msg.from.id)) {
            return;
        }
        const command = props.match[1];
        const userName = command.substring(12);
        // console.log("Attempting to unregister " + userName);
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
            const nonAdminMessage = "You have no power here! " +
                "https://giphy.com/gifs/high-quality-highqualitygifs-L0coY9I1D2BnaKln9a"
            bot.sendMessage(userId, nonAdminMessage);
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

    // console.log("in callback");
    // console.log(msg);

    bot.answerCallbackQuery(msg.id, `Inline button callback: ${msg.data}`, true); //TODO: nani?

    // console.log(msg.data);
    //Data format: {t: target, p:purpose, m:shan/stick}
    var data = JSON.parse(msg.data);
    // console.log(data);
    switch (data.p) {
        case "dead":
            // console.log("deading: " + data.t);
            return db.processDead(msg, data.t, (id, message) => {
                return bot.sendMessage(id, message);
            });
            break;
        // case "stick":
        //     // console.log("sticking: " + data.t);
        //     return db.processStick(msg, data.t,
        //         (id, message) => {
        //             return bot.sendMessage(id, message);
        //         }, (message) => {
        //             pingAdmins(bot, message);
        //         });
        //     break;
        case "killVictim":
            return db.selectVictimDialog(bot, msg, data.t);
            break;
        case "killType":
            return db.selectKillTypeDialog(bot, msg, data.t);
            break;
        case "kill":
            // console.log("killing: " + data.t);
            return db.processKill(bot, msg, data.t, data.m, (id, message) => {
                return bot.sendMessage(id, message);
            });
            break;
        case "predead":
            return db.dead(bot, msg, data.t);
            break;
        // case "prestick":
        //     return db.stick(bot, msg, data.t);
        //     break;
        case "random":
            return db.rollTeam(bot, msg, data.t);
            break;
        // case "register":
        //     return db.processRegistration(msg, data.t, (message) => {
        //         return bot.sendMessage(msg.from.id, message);
        //     });
        //     break;
        case 'cancel':
            cancelCallback(msg);
            break;
        default:
            bot.sendMessage(msg.from.id, "An unexpected error has occurred in the callback");
            break;
    }
});

function cancelCallback(msg) {
    bot.editMessageText({
            chatId: msg.message.chat.id,
            messageId: msg.message.message_id
        },
        'Your request has been cancelled!').catch(error => console.log('Error:', error));
}

function extractFirst(input) {
    var inputArray = input.split(" ");
    // console.log(inputArray);
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

// bot.on('/generate_equations', (msg) => { //nani?
//     var operands = [" + ", " - ", " * ", " / "];
//     var reply = Math.floor(Math.random() * 100);
//     for (var i = 0; i < 5; i++) {
//         reply += operands[Math.floor(Math.random() * operands.length)];
//         reply += Math.floor(Math.random() * 100);
//     }
//
//     var answer = math.eval(reply);
//
//     reply += " = " + answer;
//     bot.sendMessage(msg.chat.id, reply);
// });

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