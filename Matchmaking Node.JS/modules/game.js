// Store all ongoing matches
var ongoingGames = [];

// Match class, holds all details about a match
class Game {

    constructor(player1, player2) {
        this.matchId = ongoingGames.length + 1;
        this.player1 = player1;
        this.player2 = player2;
        this.timeLeft = 100; // Time in seconds
        this.time = 0;
        this.sentence = this.createSentence();
        this.createGame();
    }

    createSentence() {
        var sentenceArray = randomWords({ exactly: 50 });
        var sentence = sentenceArray.join(" ");

        return {
            array: sentenceArray,
            sentence: sentence
        }

    }

    createGame() {
        console.log("Game has been created with", this.matchId);
        this.sendGameData();
    }

    sendGameData() {
        // Make players join room
        this.player1.socket.join(this.matchId.toString());
        this.player2.socket.join(this.matchId.toString());

        main.server.to(this.matchId.toString()).emit('gameData', {
            player1: {
                name: this.player1.playerName,
                rank: this.player1.rank
            },
            player2: {
                name: this.player2.playerName,
                rank: this.player2.rank
            },
            match: {
                id: this.matchId,
                timeLeft: this.timeLeft,
                time: this.time,
                sentence: this.sentence
            }
        });
    }

    validateWord(socketId, currentString) {
        if (!this.checkPlayer(socketId)) {
            return false;
        }

        console.log("Word is being validated", currentString);
    }

    checkPlayer(socketId) {
        if (this.player1.socket.id == socketId) {
            return this.player1;
        } else if (this.player2.socket.id == socketId) {
            return this.player2;
        } else {
            return false;
        }
    }

    readyUp(socketId) {
        var player = this.checkPlayer(socketId);
        if (!player) {
            return false;
        }

        player.ready = 100;

        console.log(this.checkPlayer(socketId));

        if (this.player1.ready && this.player2.ready) {
            this.startGame();
        }
    }

    startGame() {
        main.server.to(this.matchId.toString()).emit('startGame')
    }

}

const main = require('../main');
const randomWords = require('random-words');

module.exports = {
    createGame: function (player1, player2) {
        ongoingGames.push(new Game(player1, player2));
    },

    readyUp: function (matchId, socketId) {
        const match = findMatch(matchId, socketId);
        if (match) {
            match.readyUp(socketId);
        }
    },

    validateWord: function (matchId, socketId, currentString) {
        const match = findMatch(matchId, socketId);
        if (match) {
            match.validateWord(socketId, currentString);
        }
    }
}

function findMatch(matchId, socketId) {
    for (let i = 0; i < ongoingGames.length; i++) {
        // Find the game
        if (ongoingGames[i].matchId == matchId) {
            // Find the player
            if (ongoingGames[i].checkPlayer(socketId)) {
                return ongoingGames[i];
            } else {
                return false;
            }
        }
    }
}

