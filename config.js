require('dotenv').config();
module.exports.botToken = process.env.BOT_TOKEN
module.exports.adminIDs = JSON.parse(process.env.ADMIN_IDS)
module.exports.isTeleLogActivate = JSON.parse(process.env.IS_TELE_LOG_ACTIVATE)
module.exports.teleLogAdminId = JSON.parse(process.env.TELE_LOG_ADMIN_ID)