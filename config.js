require('dotenv').config();
module.exports.botToken = process.env.BOT_TOKEN
module.exports.adminIDs = JSON.parse(process.env.ADMIN_IDS)
module.exports.isTeleLogActivate = JSON.parse(process.env.IS_TELE_LOG_ACTIVATE)
module.exports.teleLogAdminId = JSON.parse(process.env.TELE_LOG_ADMIN_ID)
module.exports.DbUriString = process.env.MONGODB_URI;

module.exports.SUCCESSFUL_DEATH_MESSAGE = "Congratulations, you have died successfully!";
module.exports.VALIDATE_DIRECT_MESSAGE = "Walao, don't spam people lah. Message me directly can liao.";

// TODO: move to .env
module.exports.TEAMS = ["Scone Scoopers", "Shake Shack", "Yoda Soda", "Pizza the Hutt"]; //phase 1
module.exports.TEAMLINKS = ["https://t.me/joinchat/znnCwpeRgLdjYmVl", "https://t.me/joinchat/p20ldVveuP4xOTVl", "https://t.me/joinchat/qEx3E8K0zhZjZDll", "https://t.me/joinchat/kLDG3q3q6mkzYWVl"]; //phase 1 telegram group links
// module.exports.TEAMS = ["Rebels", "Nestle"]; //phase 2
// module.exports.TEAMLINKS = ["", ""]; //phase 2 telegram group links
module.exports.GROUP_CHATS = [
    // -429367857, // dev records 1543255785
    // -1507493514, // announcements
    -1001476466450, //mega group
    -576508720, // records
    -1001375948344, // pizza
    -1001372622196, // yoda
    -1001221079857, // shake
    -1001176521025, // scone
];
module.exports.HELP_MSG =
    `https://youtu.be/pUaxXsqGeFI

The available commands for this game are:

To register, use:
/register (and follow the prompts)

To record being killed (whether Shan or Stick), use:
/dead (and follow the prompts)

To record your kill (whether Shan or Stick), use:
/kill (and follow the prompts)
Do this only after your victim has recorded their death.

To view ALL players, use:
/players

To view living players and their kill counts, use:
/targets

Please start a conversation with @Ashansins_8_bot first if you have not done so :)`
//TODO: move bot username to env
