// Matchmaking example in Node.JS
const io = require('socket.io');
const server = io.listen(4545);

// Store all ongoing matches
var ongoingMatches = [];

// Hold all queing players
var queingPlayers = [];

// Player class, holds all details about a player
class Player {

    constructor(name) {
        this.playerName = name;
        this.rank = 1;
        this.queingTime = 0;

        this.startMM();

    }

    incrementQueTime() {
        this.queingTime++;
    }

    startMM () {
        // Add to queing players
        queingPlayers.push(this);
    }

}

// Match class, holds all details about a match
class Match {

    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.timeLeft = 5; // Time in minutes
        this.turn = 1; // PLayer 1 starts

        this.startGame();
    }

    startGame() {
        console.log("Game has started with", this.player1.playerName, this.player2.playerName);
    }

}

// Search for games every 100ms
setInterval(() => {

    var player1 = null;

    // Loop through all players 
    for (let i = 0; i < queingPlayers.length; i++) {

        if (player1 == null) {
            // Add player to compare
            player1 = queingPlayers[i];
        }

        // Set player 2
        var player2 = queingPlayers[i];

        // Compare both players
        // If rank too big difference
        if (comparePlayers(player1, player2)) {

            // Remove players from que
            removePlayerFromQue(player1.playerName);
            removePlayerFromQue(player2.playerName);

            // Save the new match
            ongoingMatches.push(
                new Match(player1, player2)
            );
        }
    }

}, 100);

// Function to compare players
function comparePlayers(player1, player2) {

    var rankDifference = 0;
    // Check what player is higher in rank
    if (player1.rank > player2.rank) {
        // Player one is higher
        rankDifference = player1.rank - player2.rank;
    } else if (player2.rank > player1.rank) {
        // Player two is higher
        rankDifference = player2.rank - player1.rank;
    }

    return rankDifference > 4 ? false : true;

}

function removePlayerFromQue(playerName) {

    for (let i = 0; i < queingPlayers.length; i++) {
        if (queingPlayers[i].playerName == playerName) {
            queingPlayers.splice(i, 1);
        }
    }
}

server.on('connection', (client) => {
    console.log("Player has connected", client.id);

    client.on('startMM', (name) => {
        // Create the new player object
        var player = new Player(name);
    })
});


const names = [
    "Aaberg"
    ,
    "Aalst"
    ,
    "Aara"
    ,
    "Aaren"
    ,
    "Aarika"
    ,
    "Aaron"
    ,
    "Aaronson"
    ,
    "Ab"
    ,
    "Aba"
    ,
    "Abad"
    ,
    "Abagael"
    ,
    "Abagail"
    ,
    "Abana"
    ,
    "Abate"
    ,
    "Abba"
    ,
    "Abbate"
    ,
    "Abbe"
    ,
    "Abbey"
    ,
    "Abbi"
    ,
    "Abbie"
    ,
    "Abbot"
    ,
    "Abbotsen"
    ,
    "Abbotson"
    ,
    "Abbotsun"
    ,
    "Abbott"
    ,
    "Abbottson"
    ,
    "Abby"
    ,
    "Abbye"
    ,
    "Abdel"];

    function simulatePlayers () {
        for (let i = 0; i < names.length; i++) {
            const player = new Player(names[i]);
        }
    }
    
    simulatePlayers();