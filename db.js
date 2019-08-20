module.exports = {
    getLogs: getLogs,
    clearLogs: clearLogs,
    addLog: addLog,
    addPlayer: addPlayer,
    killPlayer: killPlayer,
    revivePlayer: revivePlayer,
    updateEquip: updateEquip,
    updateKiller: updateKiller,
    updateVictim: updateVictim,
    processDead: processDead,
    processKill: processKill,
    processRegistration: processRegistration,
    processUnregistration: processUnregistration,
    sendToAll: sendToAll,
    sendTo: sendTo,
    displayAllPlayers: displayAllPlayers,
    displayPlayers: displayPlayers,
    processStick: processStick,
    randomRevive: randomRevive,
    kill: kill,
    dead: dead,
    stick: stick,
    prekds: prekds,
    rollNation: rollNation,
    sendExterminatorScore: sendExterminatorScore,
    sendExterminatorTargets: sendExterminatorTargets,
    reviveAll: reviveAll
}

const bloodbenders_id = 0;//insert the group ids of the different group chats with the participants;
const air_id = 0//insert the group ids of the different group chats with the participants;
const fire_id = 0//insert the group ids of the different group chats with the participants;
const earth_id = 0//insert the group ids of the different group chats with the participants;
const water_id = 0//insert the group ids of the different group chats with the participants;
const unitednations_id = 323056944//insert the group ids of the different group chats with the participants;
const groupChats = [bloodbenders_id, air_id, fire_id, water_id, earth_id, unitednations_id];
const airTitle = "🌪 Air 🌪";//"✈️💨🌬 Air 🌪🦅🎈";
const waterTitle = "🌊 Water 🌊";//"🚰🌊☔️ Water ❄️🐳🍵";
const earthTitle = "⛰ Earth ⛰";//"🌍⛰🍄 Earth 🗻🐛🌚";
const fireTitle = "🔥 Fire 🔥"//"🌋🚒☀️ Fire 🔥💥👩🏻‍🚒";


function getLogs(err, cb) {
        if (err) return handleError(err);
        console.log("we reached here");
	    Message.find({'message.text' : 'francis you bitch'}).exec(function (err, result) {
	        cb(result);
	    })
	}

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

function addPlayer(err, user, message, nation, state, cb) {
    if (err) return handleError(err);
    dbmsg = new Player({
        user: user,
        message: message,
        nation: nation,
        state: state,
        equipment: "None",
        killer: "None",
        victim: "None"
    }).save(cb);
}

function killPlayer(err, user_id) {
    console.log("KILLING HERE")
    Player.findOneAndUpdate({"user.id": user_id}, { $set: {"user.state": "Dead"}, $inc: {"user.deaths" : 1}}, function(res) {
        console.log(res);
    });
}

function revivePlayer(err, user, callback, callback2) {
    Player.findOneAndUpdate({"user.name": user}, { $set: {"user.state": "Alive"}, $inc: {"user.revives" : 1}}, function(err, res) {
        if (res !== null) {
            callback(res);
            for (var i in groupChats) {
                callback2(groupChats[i], user + " has been revived!");
            }
        }
    });

}

function reviveAll(callback, callback2) {
    Player.find({"user.state": "Dead"}).exec(function(err, res){
        var dead = res;
        console.log(dead);
        if (dead.length > 0) {
            for (var i = 0; i < dead.length; i++) {
                revivePlayer(false, dead[i].user.name, function(res) {
                    callback(res);
                }, callback2);
            }
        }
    })
}

function randomRevive(nation, callback, callback2) {
        Player.find({"user.nation": nation, "user.state": "Dead"}).exec(function(err, res){
            var dead = res;
            console.log(dead);
            if (dead.length > 0) {
                var luckyGuy = dead[Math.floor(Math.random()*dead.length)];
                revivePlayer(false, luckyGuy.user.name, function(res) {
                    callback(res);
                }, callback2);
            }
        })
    }
function updateEquip(err, user, newEquip, callback) {
    Player.findOneAndUpdate({"user.name": user}, {"user.equipment": newEquip}, function(err, result) {
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
    Player.findOneAndUpdate({"user.id": user_id}, {"user.killer": killer_id}, function() {});
}

function updateSticker(err, user_id, sticker_id) {
    Player.findOneAndUpdate({"user.id": user_id}, {"user.sticker": sticker_id}, function() {});
}

function updateVictim(err, user_id, victim_id) {
    Player.findOneAndUpdate({"user.id": user_id}, {"user.victim": victim_id}, function() {});
}

function updateVictimArray(err, user_id, victim) {
    Player.findOne({"user.id": user_id}).exec(function(err, res) {
        if (res !== null) {
            var updatedVictims = JSON.parse(res.user.victims);
            console.log(updatedVictims);
            if (updatedVictims[victim.user.nation] !== null && Array.isArray(updatedVictims[victim.user.nation])) {
                updatedVictims[victim.user.nation].push(victim.user.name);
            } else {
                updatedVictims[victim.user.nation] = [victim.user.name];
            }
            console.log(updatedVictims);
            Player.findOneAndUpdate({"user.id": user_id}, { $set: {"user.victims": JSON.stringify(updatedVictims)}, $inc: {"user.kills" : 1}}, function() {});
        }
    });
    
}

function updateExterminatorCount(err, user_id, victim_id) {
    Player.findOne({"user.id": victim_id}).exec(function(err, res) {
        if (res !== null) {
            Player.findOneAndUpdate({"user.id": user_id}, {$inc: {"user.sticks" : res.user.kills}}, function() {});
        }
    });
    
}

function displayAllPlayers(callback) {
    Player.find({}).exec(function(err, result) {
         var response = "☆*:.｡. All Players .｡.:*☆\n\n";
         var airArray = getNation("air");
         appendNation(airArray, "air");
         var waterArray = getNation("water");
         appendNation(waterArray, "water");
         var earthArray = getNation("earth");
         appendNation(earthArray, "earth");
         var fireArray = getNation("fire");
         appendNation(fireArray, "fire");
         function getNation(nation) {
             var nationArray = result.filter(function(el) {
                return el.user.nation === nation;
             });
             return nationArray;
         }

         function appendNation(nationArray, nation) {
            var nationName = "Shan";
            if (nation === "air") {
                nationName = airTitle;
            } else if (nation === "water") {
                nationName = waterTitle;
            } else if (nation === "earth") {
                nationName = earthTitle;
            } else if (nation === "fire") {
                nationName = fireTitle;
            } else if (nation === "🔪") {
                nationName = "Administrators";
            } else if (nation === "spec") {
                nationName = "Spectators";
            } 
            response += "<b>" + nationName + "</b>\n";
            nationArray.sort(compareState);
            for (var i = 0; i < nationArray.length; i++) {
                var state = nationArray[i].user.state;
                var equip = nationArray[i].user.equipment;
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
                response += ((i + 1) + ". " + nationArray[i].user.name + " [" + nationArray[i].user.state + "] " + emoji + " \n");
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
  

function displayPlayers(nation, callback) {
    Player.find({"user.nation": nation}).exec(function(err, result) {
         var response = "";
         var nationArray = getNation(nation);
         appendNation(nationArray, nation);
         function getNation(nation) {
             var nationArray = result.filter(function(el) {
                return el.user.nation === nation;
             });
             return nationArray;
         }

         function appendNation(nationArray, nation) {
             var nationName = "Shan";
             if (nation === "air") {
                 nationName = airTitle;
             } else if (nation === "water") {
                 nationName = waterTitle;
             } else if (nation === "earth") {
                 nationName = earthTitle;
             } else if (nation === "fire") {
                 nationName = fireTitle;
             } else if (nation === "🔪") {
                 nationName = "Administrators";
             } else if (nation === "spec") {
                 nationName = "Spectators";
             } 
             response += "<b>" + nationName + "</b>\n";
             nationArray.sort(compareState);
             for (var i = 0; i < nationArray.length; i++) {
                 var state = nationArray[i].user.state;
                 var equip = nationArray[i].user.equipment;
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
                 response += ((i + 1) + ". " + nationArray[i].user.name + " [" + nationArray[i].user.state + "] " + emoji + " \n");
             } 

             response += "\n";
         }

         console.log(response);
         callback(response);
    })
}
function processDead(msg, target, callback) {
    var toDead = false;
    Player.findOne({"user.id": msg.from.id}).exec(function(err, victim) {
        Player.findOne({"user.name": target}).exec(function(err, res) {
            if (res !== null) {
                if (res.user.victim == msg.from.id) 
                    toDead = true;

                if (toDead) {
                    killPlayer(false, msg.from.id);
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
        Player.findOne({"user.id": msg.from.id}).exec(function(err, killer) {
            if (killer == null) {
                callback(msg.from.id, "Error!");
            } else if (killer.user.state === "Dead") {
                callback("Invalid command, you're already dead!");
            } else {
                Player.findOne({"user.name": target}).exec(function(err, res) {
                    if (res !== null) {
                        if (res.user.killer == msg.from.id) {
                            toKill = true;
                        }      

                        if (toKill) {   
                            killPlayer(false, res.user.id);  
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
        Player.findOne({"user.id": msg.from.id}).exec(function(err, sticker) {
            if (sticker.user.state === "Dead") {
                callback("Invalid command, you're already dead!");
            } else {
                Player.findOne({"user.name": target}).exec(function(err, res) {
                    if (res !== null) {
                        if (res.user.sticker == msg.from.id) {
                            toStick = true;
                        }  

                        if (toStick) {
                            killPlayer(false, res.user.id);
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
   Player.findOne({"user.name": user}).exec(function (err, result) {
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

function isValidNation(nation) {
    var arrayNation = ["air", "water", "earth", "fire", "🔪", "spec"];
    console.log(nation);
    for (var i in arrayNation) {
        if (nation === arrayNation[i])
            return true;
    }
    
    return false;
}

function isRegistered(name) {
    return Player.find({"user.name": name});
}

function processRegistration(msg, text, callback) {
    isRegistered(msg.from.first_name).exec(function (err, res) {
        var users = res.length;
        if (users > 0) {
            callback("Sorry, either you've already registered, or there is already another user with your name.");
        } else if (isValidNation(text)) {
            addPlayer(false, {
                name: msg.from.first_name,
                id: msg.from.id,
                nation: text,
                state: "Alive",
                equipment: "None",
                killer: "None yet",
                victim: "None yet",
                kills: 0,
                deaths: 0,
                sticks: 0,
                revives: 0,
                victims: "{}"
            });
            
            if (text === "🔪") {
                callback("Successful 🔪 registration!");
            } else {
                callback("Successful registration!");
            }
            
        } else {
            var bad = "You've entered an invalid command! Please type: /register <your nation>, where <your nation> can be either gry, sly, rav or huf. For example, if you're from Ravenclaw, please type: /register Rav"
            callback(bad);
        }
    });
}

function processUnregistration(msg, user, callback) {
    Player.remove({"user.name": user}).exec(function(err) {
        callback("Sucessfully unregistered!")
    });
}

function prekds(bot, msg, purpose, text) {
    let replyMarkup = bot.inlineKeyboard([
        [bot.inlineButton("Air", {callback: JSON.stringify({"target": "air", "purpose": purpose})}),
         bot.inlineButton("Water", {callback: JSON.stringify({"target": "water", "purpose": purpose})})],
        [bot.inlineButton("Earth", {callback: JSON.stringify({"target": "earth", "purpose": purpose})}), 
         bot.inlineButton("Fire", {callback: JSON.stringify({"target": "fire", "purpose": purpose})})]
    ]);
    
    if (purpose == "random" || purpose == "register") {
        bot.sendMessage(msg.chat.id, text, {replyMarkup});
    } else {
        bot.sendMessage(msg.from.id, text, {replyMarkup});
    }
    
}

function kill(bot, msg, nation) {
    Player.find({"user.nation": nation, "user.state": "Alive"}).exec(function(err, res){
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

function dead(bot, msg, nation) {
    Player.find({"user.nation": nation, "user.state": "Alive"}).exec(function(err, res){
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

function stick(bot, msg, nation) {
    
    Player.find({"user.nation": nation, "user.state": "Alive"}).exec(function(err, res){
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

function rollNation(bot, msg, nation) {
    Player.find({"user.nation": nation, "user.state": "Dead"}).exec(function(err, res){
        var alive = res;
        console.log(msg);
        if (alive.length > 0) {
            var luckyGuy = alive[Math.floor(Math.random()*alive.length)];
            bot.sendMessage(msg.message.chat.id, luckyGuy.user.name + " from the " + nation + " nation has been chosen!");
        } else {
            bot.sendMessage(msg.message.chat.id, "No one in the " + nation + " nation is dead.");
        }

    })  
}

function sendExterminatorScore(msg, callback) {
    Player.find({}).exec(function(err, res){
        var sum = 0;
        var possiblePoints = 0;
        for (var i = 0; i < res.length; i++) {
            if (res[i].user.nation == "water") {
                sum += res[i].user.sticks;
            } else if (res[i].user.state == "Alive") {
                possiblePoints += res[i].user.kills;
            }
        }
        return callback("The current score is: " + sum + "\nThere are " + possiblePoints + " points up for grabs.");
    }) 
}

function sendExterminatorTargets(callback) {
    Player.find({"user.state": "Alive"}).exec(function(err, result) {
        var response = "☆*:.｡. All Players .｡.:*☆\n\n";
        var airArray = getNation("air");
        appendNation(airArray, "air");
        var waterArray = getNation("water");
        appendNation(waterArray, "water");
        var earthArray = getNation("earth");
        appendNation(earthArray, "earth");
        var fireArray = getNation("fire");
        appendNation(fireArray, "fire");
        function getNation(nation) {
            var nationArray = result.filter(function(el) {
               return el.user.nation === nation;
            });
            return nationArray;
        }

        function appendNation(nationArray, nation) {
           var nationName = "Shan";
           if (nation === "air") {
               nationName = airTitle;
           } else if (nation === "water") {
               nationName = waterTitle;
           } else if (nation === "earth") {
               nationName = earthTitle;
           } else if (nation === "fire") {
               nationName = fireTitle;
           } else if (nation === "🔪") {
               nationName = "Administrators";
           } else if (nation === "spec") {
               nationName = "Spectators";
           } 
           response += "<b>" + nationName + "</b>\n";
           nationArray.sort(compareState);
           for (var i = 0; i < nationArray.length; i++) {
               var state = nationArray[i].user.state;
               var equip = nationArray[i].user.equipment;
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

               emoji += ": " + nationArray[i].user.kills;

               response += ((i + 1) + ". " + nationArray[i].user.name + " [" + nationArray[i].user.state + "] " + emoji + " \n");
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

var playerSchema = new mongoose.Schema({
    user: {
        name: String,
        id: Number,
        nation: String,
        state: String,
        equipment: String,
        killer: String,
        victim: String,
        sticker: String,
        kills: Number,
        deaths: Number,
        sticks: Number,
        revives: Number,
        victims: String
    },
    message: {
        chat_id: String,
        id: String,
    }
});

var Message = mongoose.model('Messages', messageSchema); 
var Player = mongoose.model('Ashansins5_Players', playerSchema);   