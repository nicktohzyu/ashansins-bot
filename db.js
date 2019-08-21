module.exports = {
    //getLogs: getLogs,
    clearLogs: clearLogs,
    addLog: addLog,
    addTribute: addTribute,
    killTribute: killTribute,
    // reviveTribute: reviveTribute,
    updateEquip: updateEquip,
    updateKiller: updateKiller,
    updateVictim: updateVictim,
    processDead: processDead,
    processKill: processKill,
    processRegistration: processRegistration,
    processUnregistration: processUnregistration,
    sendToAll: sendToAll,
    sendTo: sendTo,
    displayAllTributes: displayAllTributes,
    displayTributes: displayTributes,
    processStick: processStick,
    // randomRevive: randomRevive,
    kill: kill,
    dead: dead,
    stick: stick,
    prekds: prekds,
    rollDistrict: rollDistrict,
    sendExterminatorScore: sendExterminatorScore,
    sendExterminatorTargets: sendExterminatorTargets,
    // reviveAll: reviveAll
}

const bloodbenders_id = 0;//insert the group ids of the different group chats with the participants;
const district1_id = 0//insert the group ids of the different group chats with the participants;
const district2_id = 0//insert the group ids of the different group chats with the participants;
const district6_id = 0//insert the group ids of the different group chats with the participants;
const district12_id = 0//insert the group ids of the different group chats with the participants;
const spies_id = 0;
const allDistricts_id = 323056944//insert the group ids of the different group chats with the participants;
const groupChats = [bloodbenders_id, district1_id, district12_id, district2_id, district6_id, allDistricts_id];
const district1Title = "🌪 District 1 🌪";//"✈️💨🌬 District 1 🌪🦅🎈";
const district2Title = "🌊 District 2 🌊";//"🚰🌊☔️ District 2 ❄️🐳🍵";
const district6Title = "⛰ District 6 ⛰";//"🌍⛰🍄 District 6 🗻🐛🌚";
const district12Title = "🔥 District 12 🔥"//"🌋🚒☀️ District 12 🔥💥👩🏻‍🚒";
const spiesTitle = "Capitol Spies"

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

function addTribute(err, user, message, district, state, cb) {
    if (err) return handleError(err);
    dbmsg = new Tribute({
        user: user,
        message: message,
        district: district,
        state: state,
        equipment: "None",
        killer: "None",
        victim: "None"
    }).save(cb);
}

function killTribute(err, user_id) {
    console.log("KILLING HERE")
    Tribute.findOneAndUpdate({"user.id": user_id}, { $set: {"user.state": "Dead"}, $inc: {"user.deaths" : 1}}, function(res) {
        console.log(res);
    });
}

/*function reviveTribute(err, user, callback, callback2) {
    Tribute.findOneAndUpdate({"user.name": user}, { $set: {"user.state": "Alive"}, $inc: {"user.revives" : 1}}, function(err, res) {
        if (res !== null) {
            callback(res);
            for (var i in groupChats) {
                callback2(groupChats[i], user + " has been revived!");
            }
        }
    });

}

function reviveAll(callback, callback2) {
    Tribute.find({"user.state": "Dead"}).exec(function(err, res){
        var dead = res;
        console.log(dead);
        if (dead.length > 0) {
            for (var i = 0; i < dead.length; i++) {
                reviveTribute(false, dead[i].user.name, function(res) {
                    callback(res);
                }, callback2);
            }
        }
    })
}

function randomRevive(district, callback, callback2) {
    Tribute.find({"user.district": district, "user.state": "Dead"}).exec(function(err, res){
        var dead = res;
        console.log(dead);
        if (dead.length > 0) {
            var luckyGuy = dead[Math.floor(Math.random()*dead.length)];
            reviveTribute(false, luckyGuy.user.name, function(res) {
                callback(res);
            }, callback2);
        }
    })
}*/
function updateEquip(err, user, newEquip, callback) {
    Tribute.findOneAndUpdate({"user.name": user}, {"user.equipment": newEquip}, function(err, result) {
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

function updateKiller(err, user_id, killer_id) {
    Tribute.findOneAndUpdate({"user.id": user_id}, {"user.killer": killer_id}, function() {});
}

function updateSticker(err, user_id, sticker_id) {
    Tribute.findOneAndUpdate({"user.id": user_id}, {"user.sticker": sticker_id}, function() {});
}

function updateVictim(err, user_id, victim_id) {
    Tribute.findOneAndUpdate({"user.id": user_id}, {"user.victim": victim_id}, function() {});
}

function updateVictimArray(err, user_id, victim) {
    Tribute.findOne({"user.id": user_id}).exec(function(err, res) {
        if (res !== null) {
            var updatedVictims = JSON.parse(res.user.victims);
            console.log(updatedVictims);
            if (updatedVictims[victim.user.district] !== null && Array.isArray(updatedVictims[victim.user.district])) {
                updatedVictims[victim.user.district].push(victim.user.name);
            } else {
                updatedVictims[victim.user.district] = [victim.user.name];
            }
            console.log(updatedVictims);
            Tribute.findOneAndUpdate({"user.id": user_id}, { $set: {"user.victims": JSON.stringify(updatedVictims)}, $inc: {"user.kills" : 1}}, function() {});
        }
    });

}

function updateExterminatorCount(err, user_id, victim_id) {
    Tribute.findOne({"user.id": victim_id}).exec(function(err, res) {
        if (res !== null) {
            Tribute.findOneAndUpdate({"user.id": user_id}, {$inc: {"user.sticks" : res.user.kills}}, function() {});
        }
    });

}

function displayAllTributes(callback) {
    Tribute.find({}).exec(function(err, result) {
        var response = "☆*:.｡. All Tributes .｡.:*☆\n\n";
        var district1Array = getDistrict("district1");
        appendDistrict(district1Array, "district1");
        var district2Array = getDistrict("district2");
        appendDistrict(district2Array, "district2");
        var district6Array = getDistrict("district6");
        appendDistrict(district6Array, "district6");
        var district12Array = getDistrict("district12");
        appendDistrict(district12Array, "district12");

        // to be onz in phase 2
        /*var spiesArray = getDistrict("spies");
        appendDistrict(spiesArray, "spies");*/

        function getDistrict(district) {
            var districtArray = result.filter(function(el) {
                return el.user.district === district;
            });
            return districtArray;
        }

        function appendDistrict(districtArray, district) {
            var districtName = "Shan";
            if (district === "district1") {
                districtName = district1Title;
            } else if (district === "district2") {
                districtName = district2Title;
            } else if (district === "district6") {
                districtName = district6Title;
            } else if (district === "district12") {
                districtName = district12Title;
            } else if (district === "🔪") {
                districtName = "Administrators";
            } else if (district === "spec") {
                districtName = "Spectators";
            }
            //to be onz in Phase 2
            /*else if (district === "spies") {
                districtName = spiesTitle;
            }*/
            response += "<b>" + districtName + "</b>\n";
            districtArray.sort(compareState);
            for (var i = 0; i < districtArray.length; i++) {
                var state = districtArray[i].user.state;
                var equip = districtArray[i].user.equipment;
                var emoji = "";
                if (equip === "Coin") {
                    emoji = "💰";
                } else if (equip === "2Coin") {
                    emoji = "💰💰";
                } else if (equip === "3Coin") {
                    emoji = "💰💰💰";
                } else if (state === "Dead") {
                    var dead = ["👻", "💀", "☠️"];
                    emoji = dead[Math.floor(Math.random()*dead.length)];
                } else if (state === "Alive") {
                    var alive = ["😀","😃","😄","😁","😆","😆","😅","😂","😜","😏","😒","🤤","😬","😍","😘","🤓","😎","😑"];
                    emoji = alive[Math.floor(Math.random()*alive.length)];
                }
                response += ((i + 1) + ". " + districtArray[i].user.name + " [" + districtArray[i].user.state + "] " + emoji + " \n");
            }

            response += "\n";
        }

        console.log(response);
        callback(response);
    })
}

function compareState(a,b) {
    if (a.user.state < b.user.state)
        return -1;
    if (a.user.state > b.user.state)
        return 1;
    return 0;
}


function displayTributes(district, callback) {
    Tribute.find({"user.district": district}).exec(function(err, result) {
        var response = "";
        var districtArray = getDistrict(district);
        appendDistrict(districtArray, district);
        function getDistrict(district) {
            var districtArray = result.filter(function(el) {
                return el.user.district === district;
            });
            return districtArray;
        }

        function appendDistrict(districtArray, district) {
            var districtName = "Shan";
            if (district === "district1") {
                districtName = district1Title;
            } else if (district === "district2") {
                districtName = district2Title;
            } else if (district === "district6") {
                districtName = district6Title;
            } else if (district === "district12") {
                districtName = district12Title;
            } else if (district === "🔪") {
                districtName = "Administrators";
            } else if (district === "spec") {
                districtName = "Spectators";
            }
            // to be onz in Phase 2
            /*else if (district === "spies") {
                districtName = spiesTitle;
            }*/

            response += "<b>" + districtName + "</b>\n";
            districtArray.sort(compareState);
            for (var i = 0; i < districtArray.length; i++) {
                var state = districtArray[i].user.state;
                var equip = districtArray[i].user.equipment;
                var emoji = "";
                if (equip === "Coin") {
                    emoji = "💰";
                } else if (equip === "2Coin") {
                    emoji = "💰💰";
                } else if (equip === "3Coin") {
                    emoji = "💰💰💰";
                } else if (state === "Dead") {
                    var dead = ["👻", "💀", "☠️"];
                    emoji = dead[Math.floor(Math.random()*dead.length)];
                } else if (state === "Alive") {
                    var alive = ["😀","😃","😄","😁","😆","😆","😅","😂","😜","😏","😒","🤤","😬","😍","😘","🤓","😎","😑"];
                    emoji = alive[Math.floor(Math.random()*alive.length)];
                }
                response += ((i + 1) + ". " + districtArray[i].user.name + " [" + districtArray[i].user.state + "] " + emoji + " \n");
            }

            response += "\n";
        }

        console.log(response);
        callback(response);
    })
}
function processDead(msg, target, callback) {
    var toDead = false;
    Tribute.findOne({"user.id": msg.from.id}).exec(function(err, victim) {
        Tribute.findOne({"user.name": target}).exec(function(err, res) {
            if (res !== null) {
                if (res.user.victim == msg.from.id)
                    toDead = true;

                if (toDead) {
                    killTribute(false, msg.from.id);
                    updateVictimArray(false, res.user.id, victim);
                    callback(msg.from.id, "You've died successfully!");
                    updateExterminatorCount(false, res.user.id, msg.from.id);
                    for (var i in groupChats) {
                        callback(groupChats[i], victim.user.name + " has been killed by " + res.user.name + "!");
                    }
                } else {
                    updateKiller(false, msg.from.id, res.user.id);
                    updateSticker(false, msg.from.id, res.user.id);
                    callback(msg.from.id, "Your response has been recorded!");
                }
            } else {
                callback(msg.chat.id, "You've entered an invalid target!");
            }
            console.log(toDead);

        });
    });

}

function processKill(msg, target, callback) {
    var toKill = false;
    Tribute.findOne({"user.id": msg.from.id}).exec(function(err, killer) {
        if (killer == null) {
            callback(msg.from.id, "Error!");
        } else if (killer.user.state === "Dead") {
            callback("Invalid command, you're already dead!");
        } else {
            Tribute.findOne({"user.name": target}).exec(function(err, res) {
                if (res !== null) {
                    if (res.user.killer == msg.from.id) {
                        toKill = true;
                    }

                    if (toKill) {
                        killTribute(false, res.user.id);
                        updateVictimArray(false, msg.from.id, res);
                        updateExterminatorCount(false, msg.from.id, res.user.id);
                        callback(msg.from.id, "You SHANed successfully!");
                        for (var i in groupChats) {
                            callback(groupChats[i], target + " has been killed by " + killer.user.name + "!");
                        }
                    } else {
                        updateVictim(false, msg.from.id, res.user.id);
                        callback(msg.from.id, "Your response has been recorded!");
                    }
                } else {
                    callback(msg.chat.id, "You've entered an invalid target!");
                }


            });
        }
    });
}

function processStick(msg, target, callback, callback2) {
    var toStick = false;
    Tribute.findOne({"user.id": msg.from.id}).exec(function(err, sticker) {
        if (sticker.user.state === "Dead") {
            callback("Invalid command, you're already dead!");
        } else {
            Tribute.findOne({"user.name": target}).exec(function(err, res) {
                if (res !== null) {
                    if (res.user.sticker == msg.from.id) {
                        toStick = true;
                    }

                    if (toStick) {
                        killTribute(false, res.user.id);
                        updateVictimArray(false, msg.from.id, res);
                        callback2(target + "  got sticked by " + sticker.user.name + "!");
                        callback(msg.from.id, "You sticked successfully!");
                        updateExterminatorCount(false, msg.from.id, res.user.id);
                        for (var i in groupChats) {
                            callback(groupChats[i], target + " has been sticked by " + sticker.user.name + "!");
                        }
                    } else {
                        updateVictim(false, msg.from.id, res.user.id);
                        callback2(sticker.user.name + " is trying to stick " + target + "!");
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
    Tribute.findOne({"user.name": user}).exec(function (err, result) {
        if (result !== null) {
            callback(result.user.id, input);
        } else {
            Tribute.findOne({"user.id": user}).exec(function (err, result) {
                if (result !== null) {
                    callback(result.user.id, input);
                    callback(msg.from.id, "Sucessfully sent: " + input);
                }
            })
        }
    })
}

function sendToAll(input, callback) {
    Tribute.find({}).exec(function (err, result) {
        for (var i in result) {
            callback(result[i].user.id, input);
        }
    })
    for (var i in groupChats) {
        callback(groupChats[i], input);
    }
}

function isValidDistrict(district) {
    var arrayDistrict = ["district1", "district2", "district6", "district12", "🔪", "spec"];
    console.log(district);
    for (var i in arrayDistrict) {
        if (district === arrayDistrict[i])
            return true;
    }

    return false;
}

function isRegistered(name) {
    return Tribute.find({"user.name": name});
}

function processRegistration(msg, text, callback) {
    isRegistered(msg.from.first_name).exec(function (err, res) {
        var users = res.length;
        if (users > 0) {
            callback("Sorry, either you've already registered, or there is already another user with your name.");
        } else if (isValidDistrict(text)) {
            addTribute(false, {
                name: msg.from.first_name,
                id: msg.from.id,
                district: text,
                state: "Alive",
                equipment: "None",
                killer: "None yet",
                victim: "None yet",
                kills: 0,
                deaths: 0,
                sticks: 0,
                // revives: 0,
                victims: "{}"
            });

            if (text === "🔪") {
                callback("Successful 🔪 registration!");
            } else {
                callback("Successful registration!");
            }

        } else {
            var bad = "You've entered an invalid command! Please type: /register <your district>, where <your district> can be either district1, district2, district6 or district12. For example, if you're from district 2, please type: /register district2"
            callback(bad);
        }
    });
}

function processUnregistration(msg, user, callback) {
    Tribute.remove({"user.name": user}).exec(function(err) {
        callback("Sucessfully unregistered!")
    });
}

function prekds(bot, msg, purpose, text) {
    let replyMarkup = bot.inlineKeyboard([
        [bot.inlineButton("District 1", {callback: JSON.stringify({"target": "district1", "purpose": purpose})}),
            bot.inlineButton("District 2", {callback: JSON.stringify({"target": "district2", "purpose": purpose})})],
        [bot.inlineButton("District 6", {callback: JSON.stringify({"target": "district6", "purpose": purpose})}),
            bot.inlineButton("District 12", {callback: JSON.stringify({"target": "district12", "purpose": purpose})})],
        // [bot.inlineButton("Capitol Spies", {callback: JSON.stringify({"target": "spies", "purpose": purpose})}),
        //      ],
    ]);

    if (purpose == "random" || purpose == "register") {
        bot.sendMessage(msg.chat.id, text, {replyMarkup});
    } else {
        bot.sendMessage(msg.from.id, text, {replyMarkup});
    }
}

function kill(bot, msg, district) {
    Tribute.find({"user.district": district, "user.state": "Alive"}).exec(function(err, res){
        var alive = res;
        var hitlist = [];

        for (var i = 0; i < alive.length; i++) {
            var packet = {"target": alive[i].user.name,
                "purpose": "kill"};
            hitlist.push([bot.inlineButton(alive[i].user.name, {callback: JSON.stringify(packet)})]);
        }


        console.log(hitlist);

        let replyMarkup = bot.inlineKeyboard(
            hitlist
        );

        bot.sendMessage(msg.from.id, "Who would you like to kill?", {replyMarkup});
    })
}

function dead(bot, msg, district) {
    Tribute.find({"user.district": district, "user.state": "Alive"}).exec(function(err, res){
        var alive = res;
        var hitlist = [];

        for (var i = 0; i < alive.length; i++) {
            var packet = {"target": alive[i].user.name,
                "purpose": "dead"};
            hitlist.push([bot.inlineButton(alive[i].user.name, {callback: JSON.stringify(packet)})]);
        }


        let replyMarkup = bot.inlineKeyboard(
            hitlist
        );

        bot.sendMessage(msg.from.id, "Who did you get killed by?", {replyMarkup});
    })
}

function stick(bot, msg, district) {

    Tribute.find({"user.district": district, "user.state": "Alive"}).exec(function(err, res){
        var alive = res;
        var hitlist = [];

        for (var i = 0; i < alive.length; i++) {
            var packet = {"target": alive[i].user.name,
                "purpose": "stick"};
            hitlist.push([bot.inlineButton(alive[i].user.name, {callback: JSON.stringify(packet)})]);
        }


        let replyMarkup = bot.inlineKeyboard(
            hitlist
        );

        bot.sendMessage(msg.from.id, "Who would you like to stick?", {replyMarkup});
    })
}

function rollDistrict(bot, msg, district) {
    Tribute.find({"user.district": district, "user.state": "Dead"}).exec(function(err, res){
        var alive = res;
        console.log(msg);
        if (alive.length > 0) {
            var luckyGuy = alive[Math.floor(Math.random()*alive.length)];
            bot.sendMessage(msg.message.chat.id, luckyGuy.user.name + " from " + district + " has been chosen!");
        } else {
            bot.sendMessage(msg.message.chat.id, "No one in " + district + " is dead.");
        }

    })
}

function sendExterminatorScore(msg, callback) {
    Tribute.find({}).exec(function(err, res){
        var sum = 0;
        var possiblePoints = 0;
        for (var i = 0; i < res.length; i++) {
            if (res[i].user.district == "district2") {
                sum += res[i].user.sticks;
            } else if (res[i].user.state == "Alive") {
                possiblePoints += res[i].user.kills;
            }
        }
        return callback("The current score is: " + sum + "\nThere are " + possiblePoints + " points up for grabs.");
    })
}

function sendExterminatorTargets(callback) {
    Tribute.find({"user.state": "Alive"}).exec(function(err, result) {
        var response = "☆*:.｡. All Tributes .｡.:*☆\n\n";
        var district1Array = getDistrict("district1");
        appendDistrict(district1Array, "district1");
        var district2Array = getDistrict("district2");
        appendDistrict(district2Array, "district2");
        var district6Array = getDistrict("district6");
        appendDistrict(district6Array, "district6");
        var district12Array = getDistrict("district12");
        appendDistrict(district12Array, "district12");

        // to be onz in phase 2
        /*
        var spiesArray = getDistrict("spies");
        appendDistrict(spiesArray, "spies");
         */

        function getDistrict(district) {
            var districtArray = result.filter(function(el) {
                return el.user.district === district;
            });
            return districtArray;
        }

        function appendDistrict(districtArray, district) {
            var districtName = "Shan";
            if (district === "district1") {
                districtName = district1Title;
            } else if (district === "district2") {
                districtName = district2Title;
            } else if (district === "district6") {
                districtName = district6Title;
            } else if (district === "district12") {
                districtName = district12Title;
            } else if (district === "🔪") {
                districtName = "Administrators";
            } else if (district === "spec") {
                districtName = "Spectators";
            }

            //to be onz in phase 2
            /*
            } else if (district === "spies") {
                districtName = spiesTitle;
            }
             */

            response += "<b>" + districtName + "</b>\n";
            districtArray.sort(compareState);
            for (var i = 0; i < districtArray.length; i++) {
                var state = districtArray[i].user.state;
                var equip = districtArray[i].user.equipment;
                var emoji = "";
                if (equip === "Coin") {
                    emoji = "💰";
                } else if (equip === "2Coin") {
                    emoji = "💰💰";
                } else if (equip === "3Coin") {
                    emoji = "💰💰💰";
                } else if (state === "Dead") {
                    var dead = ["👻", "💀", "☠️"];
                    emoji = dead[Math.floor(Math.random()*dead.length)];
                } else if (state === "Alive") {
                    var alive = ["😀","😃","😄","😁","😆","😆","😅","😂","😜","😏","😒","🤤","😬","😍","😘","🤓","😎","😑"];
                    emoji = alive[Math.floor(Math.random()*alive.length)];
                }

                emoji += ": " + districtArray[i].user.kills;

                response += ((i + 1) + ". " + districtArray[i].user.name + " [" + districtArray[i].user.state + "] " + emoji + " \n");
            }

            response += "\n";
        }

        console.log(response);
        callback(response);
    })
}


var mongoose = require("mongoose");

var uristring = "mongodb+srv://hemanshu:ebjtugBI6pV9s5MQ@cluster1-xpdov.mongodb.net/test?retryWrites=true&w=majority";
//  process.env.MONGODB_URI;

function handleError(err) {
    if (err) {
        return "Error occured in db.js";
    }
}


mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log('Succeeded connected to: ' + uristring);
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

var tributeSchema = new mongoose.Schema({
    user: {
        name: String,
        id: Number,
        district: String,
        state: String,
        equipment: String,
        killer: String,
        victim: String,
        sticker: String,
        kills: Number,
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

var Message = mongoose.model('Messages', messageSchema);
var Tribute = mongoose.model('Ashansins6_Tributes', tributeSchema);   