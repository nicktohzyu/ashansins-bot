const fs = require('fs');

const inFileName = "phase1players_snapshot_2021-01-25T15.09+8.json";
const outFileName = "phase2Starting_players.json";

let players
fs.readFile(inFileName, async (err, data) => {
    if (err) {
        throw err;
    }
    players = JSON.parse(data);
    // console.log(players);

    const avengers = [];
    const thanos = [];
    for(const player of players){
        player.user.killer_id = 0;
        player.user.can_claim_kill = false;
        if(player.user.state === "Dead"){
            player.user.state = "Alive";
            player.user.team = "Thanos";
            thanos.push(player);
        } else if(player.user.state === "Alive"){
            player.user.team = "Avengers";
            avengers.push(player);
        } else{
            console.error("Error: unexpected state");
        }
    }

    const outPlayers = avengers.concat(thanos);
    const outData = JSON.stringify(outPlayers,null, 2);
    await fs.writeFileSync(outFileName, outData);
    // console.log(outPlayers);
});