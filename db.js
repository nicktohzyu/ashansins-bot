module.exports = {
    //getLogs: getLogs,
    clearLogs: clearLogs,
    addLog: addLog,
    killPlayer: recordUserKilled,
    revivePlayer: revivePlayer,
    processDead: processDead,
    processKill: processKill,
    processRegistration: processRegistration,
    processUnregistration: processUnregistration,
    sendToAll: sendToAll,
    sendTo: sendTo,
    displayAllPlayers: displayAllPlayers,
    processStick: processStick,
    selectVictimDialog: selectVictimDialog,
    selectKillTypeDialog: selectKillTypeDialog,
    dead: dead,
    stick: stick,
    selectTeamDialog: selectTeamDialog,
    rollDistrict: rollTeam,
    sendExterminatorTargets: displayLivingPlayers,
    // reviveAll: reviveAll
}

const team1_id = -391986817;//insert the group ids of the different group chats with the participants;
const team2_id = -264119959;//insert the group ids of the different group chats with the participants;
const team6_id = -364865565;//insert the group ids of the different group chats with the participants;
const team12_id = -358638029;//insert the group ids of the different group chats with the participants;
const resistance_id = -390663740;
const capitol_id = -338862508;
const allTeams_id = -1001215955875;//insert the group ids of the different group chats with the participants;
const groupChats = []; //[resistance_id, capitol_id, allTeams_id];
//const team1Title = "💎 Team 1 💎";//"✈️💨🌬 Team 1 🌪🦅🎈";
//const team2Title = "🛡 Team 2 🛡";//"🚰🌊☔️ Team 2 ❄️🐳🍵";
//const team6Title = "🌋 Team 6 🌋";//"🌍⛰🍄 Team 6 🗻🐛🌚";
//const team12Title = "🔥 Team 12 🔥"//"🌋🚒☀️ Team 12 🔥💥👩🏻‍🚒";
// const resistanceTitle = "⚔️ Resistance ⚔️";
// const capitolTitle = "🌹 Capitol 🌹";


const mongoose = require("mongoose");
const {DbUriString, SUCCESSFUL_DEATH_MESSAGE, TEAMS} = require("./config")

// "mongodb+srv://hemanshu:ebjtugBI6pV9s5MQ@cluster1-xpdov.mongodb.net/ashansins7?retryWrites=true&w=majority";

function handleError(err) {
    if (err) {
        return "Error occured in db.js";
    }
}

mongoose.connect(DbUriString, function (err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + DbUriString + '. ' + err);
    } else {
        console.log('Succeeded connected to: ' + DbUriString);
    }
});

var messageSchema = new mongoose.Schema({
    user: {
        name: String,
        id: Number
    },
    message: {
        chat_id: String,
        id: String,
        text: String
    },
    timestamp: String
});

var playerSchema = new mongoose.Schema({
    user: {
        name: String, //first name
        username: String,
        id: Number,
        team: String,
        state: String,
        equipment: String,
        killer_id: Number,
        victim_id: Number,
        sticker_id: Number,
        shans: Number,
        deaths: Number,
        sticks: Number,
        // revives: Number,
        victims: String
    },
    message: {
        chat_id: String,
        id: String,
    }
});

var Message = mongoose.model('Message', messageSchema);
var Player = mongoose.model('Phase1Player', playerSchema);
// var Player = mongoose.model('Phase2Player', playerSchema);

/*
// This command crashes the application. Also it it not used in the app. Commented out for ashansins6
function getLogs(err, cb) {
    if (err) return handleError(err);
    console.log("we reached here");
    Message.find({'message.text' : 'francis you bitch'}).exec(function (err, result) {
        cb(result);
    })
}
*/

function clearLogs(err, cb) {
    if (err) return handleError(err);
    Message.remove({}, cb);
}

function addLog(err, user, message, cb) {
    if (err) return handleError(err);
    dbmsg = new Message({
        user: user,
        message: message,
        timestamp: new Date().toISOString()
    }).save(cb);
}

function addPlayer(user, message, team, state, cb) {
    // TODO: error catching
    dbmsg = new Player({
        user: user,
        message: message,
        team: team,
        state: state,
        equipment: "None",
        killer: "None",
        victim: "None"
    }).save(cb);
}

function recordUserKilled(err, user_id) {
    console.log("recording " + user_id + " as dead");
    Player.findOneAndUpdate({"user.id": user_id}, {
        $set: {
            "user.state": "Dead"
        },
        $inc: {"user.deaths": 1}
    }, function (res) {
        // console.log(res);
    });
}

function revivePlayer(err, user, callback, callback2) {
    Player.findOneAndUpdate({"user.username": user}, {
        $set: {"user.state": "Alive"},
        $inc: {"user.revives": 1}
    }, function (err, res) {
        if (res !== null) {
            callback(res);
            for (var i in groupChats) {
                callback2(groupChats[i], user + " has been revived!");
            }
        }
    });

}

/*
function reviveAll(callback, callback2) {
    Player.find({"user.state": "Dead"}).exec(function(err, res){
        var dead = res;
        console.log(dead);
        if (dead.length > 0) {
            for (var i = 0; i < dead.length; i++) {
                revivePlayer(false, dead[i].user.username, function(res) {
                    callback(res);
                }, callback2);
            }
        }
    })
}

function randomRevive(team, callback, callback2) {
    Player.find({"user.team": team, "user.state": "Dead"}).exec(function(err, res){
        var dead = res;
        console.log(dead);
        if (dead.length > 0) {
            var luckyGuy = dead[Math.floor(Math.random()*dead.length)];
            revivePlayer(false, luckyGuy.user.username, function(res) {
                callback(res);
            }, callback2);
        }
    })
}
*/
function updateEquip(err, user, newEquip, callback) {
    Player.findOneAndUpdate({"user.username": user}, {"user.equipment": newEquip}, function (err, result) {
        var message;
        if (result !== null) {
            if (newEquip === "Coin") {
                message = "You've found, One Gold Bar!💰";
            } else if (newEquip === "2Coin") {
                message = "You've found, Two Gold Bars!💰💰";
            } else if (newEquip === "3Coin") {
                message = "You've found, Three Gold Bars!💰💰💰";
            } else {
                message = "Your inventory is now empty!";
            }
            callback(result, message);
        }
    });
}

function updateKiller(err, user_id, killerId) {
    Player.findOneAndUpdate({"user.id": user_id}, {"user.killer_id": killerId}, function () {
    });
}

function updateSticker(err, user_id, sticker_id) {
    Player.findOneAndUpdate({"user.id": user_id}, {"user.sticker": sticker_id}, function () {
    });
}

function updateVictim(err, killer_id, victim_id) {
    Player.findOneAndUpdate({"user.id": killer_id}, {"user.victim": victim_id}, function () {
    });
}

function updateVictimArray(err, user_id, victim) {
    Player.findOne({"user.id": user_id}).exec(function (err, res) {
        if (res !== null) {
            var updatedVictims = JSON.parse(res.user.victims);
            console.log(updatedVictims);
            if (updatedVictims[victim.user.team] !== null && Array.isArray(updatedVictims[victim.user.team])) {
                updatedVictims[victim.user.team].push(victim.user.username);
            } else {
                updatedVictims[victim.user.team] = [victim.user.username];
            }
            console.log(updatedVictims);
            Player.findOneAndUpdate({"user.id": user_id}, {
                $set: {"user.victims": JSON.stringify(updatedVictims)},
            }, function () {
            });
        }
    });

}

async function updateExterminatorCount(err, user_id, victim_id, killType) {
    try {
        if (killType === "shan") {
            Player.findOneAndUpdate({"user.id": user_id},
                {$inc: {"user.shans": 1}},
                function () {
                });
        } else if (killType === "stick") {
            Player.findOneAndUpdate({"user.id": user_id},
                {$inc: {"user.sticks": 1}},
                function () {
                });
        } else {
            console.log("Error: Invalid kill type");
        }
    } catch (e) {
        console.log("Unknown error encountered in updating kill count");
        console.log(e);
        throw(e);
    }
}

/**
 * Gets list of team members as array.
 * @param team team name
 * @returns array of team members.
 */
async function getTeamMembers(team) {
    const teamArray = await Player.find({"user.team": team}).exec();
    return teamArray;
}

function getTeamStr(members, teamName) {
    let teamStr = "";
    teamStr += "<b>" + teamName + "</b>\n";
    for (var i = 0; i < members.length; i++) {
        teamStr += (i + 1) + ". " + getPlayerStatusStr(members[i]);
    }
    teamStr += "\n";
    return teamStr;
}

function getPlayerStatusStr(player) {
    var state = player.user.state;
    var emoji = "";
    if (state === "Dead") {
        var dead = ["👻", "💀", "☠️"];
        emoji = dead[Math.floor(Math.random() * dead.length)];
    } else if (state === "Alive") {
        var alive = ["😀", "😃", "😄", "😁", "😆", "😆", "😅", "😂", "😜", "😏", "😒", "🤤", "😬", "😍", "😘", "🤓", "😎", "😑"];
        emoji = alive[Math.floor(Math.random() * alive.length)];
    }
    return player.user.username + " [" + player.user.state + "] " + emoji + " \n";
}

/**
 * Creates list of all players grouped by team and their status.
 * @param callback
 */
async function displayAllPlayers(callback) {
    let str = "☆*:.｡. All Players .｡.:*☆\n\n";
    for (const team of TEAMS) {
        const members = await getTeamMembers(team);
        members.sort(compareState); //alive ahead of dead
        const teamStr = getTeamStr(members, team);
        str += teamStr;
    }
    callback(str);
}

function compareState(a, b) {
    if (a.user.state < b.user.state)
        return -1;
    if (a.user.state > b.user.state)
        return 1;
    return 0;
}

function processDead(msg, killerUsername, callback) {
    var toDead = false;
    Player.findOne({"user.id": msg.from.id}).exec(function (err, victim) {
        Player.findOne({"user.username": killerUsername}).exec(function (err, killer) {
            if (killer === null) {
                callback(msg.chat.id, "You've entered an invalid target!");
                return;
            }
            console.log("processing death of " + msg.from.username + " by " + killerUsername);

            recordUserKilled(false, msg.from.id);
            updateKiller(false, msg.from.id, killer.user.id);
            // updateVictimArray(false, killer.user.id, victim);
            callback(msg.from.id, SUCCESSFUL_DEATH_MESSAGE);
            // updateExterminatorCount(false, killer.user.id, msg.from.id);
            // for (var i in groupChats) {
            //     callback(groupChats[i], victim.user.username + " has been killed by " + killer.user.username + "!");
            // }
            // updateSticker(false, msg.from.id, killer.user.id);

        });
    });

}

function processKill(msg, victimUsername, killType, callback) {
    //TODO: check whether stick or shan
    Player.findOne({"user.id": msg.from.id}).exec(function (err, killer) {
        if (killer == null) {
            callback(msg.from.id, "Sorry, an unexpected error occured!");
            return;
        } else if (killer.user.state === "Dead") {
            callback("Invalid command, you can't kill someone when you're already dead!");
            return;
        }
        Player.findOne({"user.username": victimUsername}).exec(async function (err, victim) {
            //TODO: ensure exactly one
            //TODO: use ID instead of username
            if (victim !== null) {
                if (victim.user.state !== "Dead") {
                    await callback(msg.from.id, "Your victim is not recorded as dead, they should first record being killed");
                    return;
                }
                if (victim.user.killer_id !== msg.from.id) {
                    await callback(msg.from.id, "Error: your victim did not record being killed by you");
                    return;
                }
                //TODO: check that victim is unclaimed (can only be claimed once)

                // recordUserKilled(false, victim.user.id); //victim should register death themselves
                updateVictim(false, msg.from.id, victim.user.id);
                updateVictimArray(false, msg.from.id, victim);
                updateExterminatorCount(false, msg.from.id, victim.user.id, killType);

                // TODO: abstract notify groupchats method
                // for (var i in groupChats) {
                //     callback(groupChats[i], target + " has been killed by " + killer.user.username + "!");
                // }
                // TODO: wait for update DB to complete without error before sending success message
                callback(msg.from.id, "Your kill has been recorded, you " + killType.toUpperCase() + "ed successfully!");
            } else {
                callback(msg.chat.id, "You've entered an invalid target!");
            }
        });

    });
}

function processStick(msg, target, callback, callback2) {
    var toStick = false;
    Player.findOne({"user.id": msg.from.id}).exec(function (err, sticker) {
        if (sticker.user.state === "Dead") {
            callback("Invalid command, you're already dead!");
        } else {
            Player.findOne({"user.username": target}).exec(function (err, res) {
                if (res !== null) {
                    if (res.user.sticker == msg.from.id) {
                        toStick = true;
                    }

                    if (toStick) {
                        recordUserKilled(false, res.user.id);
                        updateVictimArray(false, msg.from.id, res);
                        callback2(target + "  got sticked by " + sticker.user.username + "!");
                        callback(msg.from.id, "You sticked successfully!");
                        updateExterminatorCount(false, msg.from.id, res.user.id);
                        for (var i in groupChats) {
                            callback(groupChats[i], target + " has been sticked by " + sticker.user.username + "!");
                        }
                    } else {
                        updateVictim(false, msg.from.id, res.user.id);
                        callback2(sticker.user.username + " is trying to stick " + target + "!");
                        callback(msg.from.id, "Your response has been recorded!");
                    }
                } else {
                    callback(msg.chat.id, "You've entered an invalid target!");
                }


            });
        }
    });
}

function sendTo(user, input, msg, callback) {
    Player.findOne({"user.username": user})
        .exec(function (err, result) {
            if (result !== null) {
                callback(result.user.id, input);
            } else {
                Player.findOne({"user.id": user}).exec(function (err, result) {
                    if (result !== null) {
                        callback(result.user.id, input);
                        callback(msg.from.id, "Sucessfully sent: " + input);
                    }
                })
            }
        })
}

function sendToAll(input, callback) {
    Player.find({}).exec(function (err, result) {
        for (var i in result) {
            callback(result[i].user.id, input);
        }
    })
    for (var i in groupChats) {
        callback(groupChats[i], input);
    }
}

function isValidTeam(team) {
    console.log(team);
    for (const t of TEAMS) {
        if (team === t) {
            return true;
        }
    }
    return false;
}

async function isRegistered(userId) {
    const matches = await Player.find({"user.id": userId}).exec();
    return matches.length > 0;
}

async function processRegistration(msg, team, callback) {
    if (await isRegistered(msg.from.id)) {
        callback("Either you've already registered, or we have encountered an error.");
        return;
    }
    if (!isValidTeam(team)) {
        console.log("Error in processing registration, invalid team");
        const bad = "An unknown error in team selection has occurred, please contact the bot developer"
        callback(bad);
        return;
    }
    try {
        addPlayer({
            name: msg.from.first_name,
            username: msg.from.username,
            id: msg.from.id,
            team: team,
            state: "Alive",
            equipment: "None",
            killer_id: 0,
            victim_id: 0,
            shans: 0,
            deaths: 0,
            sticks: 0,
            // revives: 0,
            victims: "{}"
        });
    } catch (e) {
        callback("An error occured in registration!");
        return;
    }
    callback("Successful registration!");
}

// function processUnregistration(msg, user, callback) {
//     Player.remove({"user.username": user})
//         .exec(function (err) {
//             callback("Sucessfully unregistered!")
//         });
// }

async function processUnregistration(msg, userName, callback) {
    const doc = await Player.findOneAndDelete({"user.username": userName})
        .exec();
    if (doc) {
        //doc not null means user exists
        callback("User successfully unregistered")
    } else {
        callback("Invalid user");
    }
}

// try {
//
// } catch (e) {
//     callback("An error occured:\n" + e);
// }

function selectTeamDialog(bot, msg, purpose, text) {
    // choose team
    const buttons = [];
    for (const team of TEAMS) {
        const button = bot.inlineButton(team, {
            callback: JSON.stringify({
                "t": team,
                "p": purpose
            })
        });
        buttons.push([button]);
    }
    const replyMarkup = bot.inlineKeyboard(
        buttons
    );

    if (purpose == "random" || purpose == "register") {
        bot.sendMessage(msg.chat.id, text, {replyMarkup});
    } else {
        bot.sendMessage(msg.from.id, text, {replyMarkup});
    }
}

function selectVictimDialog(bot, msg, team) {
    //TODO: only show unclaimed kills
    Player.find({"user.team": team}).exec(function (err, victims) {
        //TODO: check for empty victims list
        const buttons = [];

        for (var i = 0; i < victims.length; i++) {
            var packet = {
                "t": victims[i].user.username,
                "p": "killType"
            };
            buttons.push([bot.inlineButton(victims[i].user.username, {callback: JSON.stringify(packet)})]);
        }

        // console.log(hitlist);

        let replyMarkup = bot.inlineKeyboard(
            buttons
        );

        bot.sendMessage(msg.from.id, "Who did you kill?", {replyMarkup});
    })
}

function selectKillTypeDialog(bot, msg, target) {
    const buttons = [];
    const shanPacket = {
        "t": target,
        "p": "kill",
        "m": "shan"
    };
    buttons.push([bot.inlineButton("shan", {callback: JSON.stringify(shanPacket)})]);
    var stickPacket = {
        "t": target,
        "p": "kill",
        "m": "stick"
    };
    buttons.push([bot.inlineButton("stick", {callback: JSON.stringify(stickPacket)})]);


    let replyMarkup = bot.inlineKeyboard(
        buttons
    );

    bot.sendMessage(msg.from.id, "How did you kill " + target + "?", {replyMarkup});
}

function dead(bot, msg, team) {
    Player.find({"user.team": team, "user.state": "Alive"}).exec(function (err, alive) {
        if (alive.length < 1) {
            bot.sendMessage(msg.from.id, "Error, it appears that there are no players alive in team " + team);
            return;
        }

        var buttons = [];
        for (var i = 0; i < alive.length; i++) {
            var packet = {
                "t": alive[i].user.username,
                "p": "dead"
            };
            buttons.push([bot.inlineButton(alive[i].user.username, {callback: JSON.stringify(packet)})]);
        }
        let replyMarkup = bot.inlineKeyboard(
            buttons
        );
        bot.sendMessage(msg.from.id, "Who did you get killed by?", {replyMarkup});
    })
}

function stick(bot, msg, team) {

    Player.find({"user.team": team, "user.state": "Alive"}).exec(function (err, res) {
        var alive = res;
        var hitlist = [];

        for (var i = 0; i < alive.length; i++) {
            var packet = {
                "t": alive[i].user.username,
                "p": "stick"
            };
            hitlist.push([bot.inlineButton(alive[i].user.username, {callback: JSON.stringify(packet)})]);
        }


        let replyMarkup = bot.inlineKeyboard(
            hitlist
        );

        bot.sendMessage(msg.from.id, "Who would you like to stick?", {replyMarkup});
    })
}

function rollTeam(bot, msg, team) {
    Player.find({"user.team": team, "user.state": "Dead"}).exec(function (err, res) {
        var alive = res;
        console.log(msg);
        if (alive.length > 0) {
            var luckyGuy = alive[Math.floor(Math.random() * alive.length)];
            bot.sendMessage(msg.message.chat.id, luckyGuy.user.username + " from " + team + " has been chosen!");
        } else {
            bot.sendMessage(msg.message.chat.id, "No one in " + team + " is dead.");
        }

    })
}

/**
 * Gets list of living team members as array.
 * @param team team name
 * @returns array of living team members.
 */
async function getLivingTeamMembers(team) {
    const teamArray = await Player.find({
        "user.team": team,
        "user.state": "Alive"
    }).exec();
    return teamArray;
}

function getLivingTeamStr(members, teamName) {
    let teamStr = "";
    teamStr += "<b>" + teamName + "</b>\n";
    for (var i = 0; i < members.length; i++) {
        teamStr += (i + 1) + ". " + getPlayerKillsStr(members[i]);
    }
    teamStr += "\n";
    return teamStr;
}

function getPlayerKillsStr(player) {
    const numShans = player.user.shans;
    const numSticks = player.user.sticks;
    return player.user.username + " [Shans: " + numShans + ", Sticks: " + numSticks + "] " + " \n";
}

function killsComparator(a, b) {
    const aKills = a.user.shans + a.user.sticks;
    const bKills = b.user.shans + b.user.sticks;
    if (aKills < bKills) {
        return 1;
    }
    if (aKills > bKills) {
        return -1;
    }
    return 0;
}

/**
 * Creates list of still living players grouped by team and their number of kills.
 * @param callback
 */
async function displayLivingPlayers(callback) {
    let str = "☆*:.｡. Living Players .｡.:*☆\n\n";
    for (const team of TEAMS) {
        const members = await getLivingTeamMembers(team);
        members.sort(killsComparator);
        const teamStr = getLivingTeamStr(members, team);
        str += teamStr;
    }
    callback(str);
}
