require('dotenv').config();
module.exports.botToken = process.env.BOT_TOKEN
module.exports.adminIDs = JSON.parse(process.env.ADMIN_IDS)
module.exports.isTeleLogActivate = JSON.parse(process.env.IS_TELE_LOG_ACTIVATE)
module.exports.teleLogAdminId = JSON.parse(process.env.TELE_LOG_ADMIN_ID)
module.exports.DbUriString = process.env.MONGODB_URI;

module.exports.SUCCESSFUL_DEATH_MESSAGE = "Congratulations, you have died successfully!";
module.exports.TEAMS = ["Wakanda", "Guardians", "Asgard", "SHIELD"];