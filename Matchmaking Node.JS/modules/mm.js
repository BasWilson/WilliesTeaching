// Hold all queing players
var queingPlayers = [];

// Player class, holds all details about a player
class Player {

    constructor(name, socket) {
        this.playerName = name;
        this.socket = socket;
        this.rank = 1;
        this.queingTime = 0;
        this.activeWord = 0;
        this.ready = false;
        this.matchFound = false;
        this.startMM();
    }

    incrementQueTime() {
        this.queingTime++;
    }

    startMM() {
        // Add to queing players
        queingPlayers.push(this);
        console.log('PLayer has been added to que')
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

            // Set the status to match found.
            player1.matchFound = true;
            player2.matchFound = true;

            // Remove players from que
            removePlayerFromQue(player1.playerName);
            removePlayerFromQue(player2.playerName);

            // Create the game
            game.createGame(player1, player2);
        }
    }

}, 100);

// Function to compare players
function comparePlayers(player1, player2) {

    // Check if its not the same player
    if (player1.playerName == player2.playerName) {
        return false;
    }

    // Check if the players have already found a match
    if (player1.matchFound || player2.matchFound) {
        return false;
    }

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

const main = require('../main');
const game = require('./game');

module.exports = {
    newPlayer: function (name, socket) {
        new Player(name, socket);
    }
}
