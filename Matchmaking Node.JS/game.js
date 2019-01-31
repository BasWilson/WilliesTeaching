const socket = io('http://localhost:4545');

function startMM () {
    const name = document.getElementById('name').value;
    socket.emit('startMM', name);
}