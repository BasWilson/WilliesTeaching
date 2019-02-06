const socket = io('http://localhost:4545');

function startMM () {
    createLoader();
    const name = document.getElementById('name').value;
    socket.emit('startMM', name);
    deleteElements(['name-field-div']);
}

function gameData (matchSettings) {
    deleteElements(['loader']);
    console.log(matchSettings);
    const html = `
        <div id="match-settings">
            <p>Match ID: ${matchSettings.match.id}</p>
            <p>Player1: ${matchSettings.player1.name}, Rank: ${matchSettings.player1.rank}</p>
            <p>Player2: ${matchSettings.player2.name}, Rank: ${matchSettings.player2.rank}</p>
        </div>
    `;

    document.getElementById('game-div').innerHTML += html;
    
    socket.emit('ready', matchSettings.match.id);
}

socket.on('gameData', (matchSettings) => {
    gameData(matchSettings);
});

socket.on('startGame', () => {
    console.log("Game started")
});

function createLoader () {
    const loader = `
        <div class="loader" id="loader">
            <img src="assets/loader.svg" /> 
        </div>
    `;
    document.getElementById('game-div').innerHTML += loader;
}

function deleteElements (elements) {
    for (let i = 0; i < elements.length; i++) {
        document.getElementById(elements[i]).remove();
    }
}