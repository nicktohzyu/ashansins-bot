require('dotenv').config();
module.exports.botToken = process.env.BOT_TOKEN
module.exports.adminIDs = JSON.parse(process.env.ADMIN_IDS)
module.exports.isTeleLogActivate = JSON.parse(process.env.IS_TELE_LOG_ACTIVATE)
module.exports.teleLogAdminId = JSON.parse(process.env.TELE_LOG_ADMIN_ID)
module.exports.DbUriString = process.env.MONGODB_URI;

module.exports.SUCCESSFUL_DEATH_MESSAGE = "Congratulations, you have died successfully!";
module.exports.TEAMS = ["Wakanda", "Guardians", "Asgard", "SHIELD"];
module.exports.GROUP_CHATS = [-350775032, -479881289,
    -483192819, // wakanda
    -428372620, // guardians
    -458788961, // shield
    -330611685 //asgard
];
module.exports.HELP_MSG =
    `The available commands for this game are:

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

Please start a conversation with @ashansins7_bot first if you have not done so :)`

