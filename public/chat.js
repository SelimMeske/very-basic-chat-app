let socket = io();

let button = document.getElementById('button');
let handler = document.getElementById('handler');
let output = document.getElementById('output');
let message = document.getElementById('message');
let partner = document.getElementById('partner');

function emitMsg() { socket.emit('chat', {
    message: message.value,
    partner: partner.value,
    sender: handler.value
})
}
button.addEventListener('click', () => {
    emitMsg();
});

document.addEventListener('keypress', (e) => {
    let key = e.which;
    if(key === 13){
        emitMsg();
    }
});

socket.on('chat', (data) => {
    
    if(handler.value === data.sender){
        output.innerHTML += `<div id="chatMsg" class="bg-primary">${data.message}</div>`
        output.scrollTop = output.scrollHeight;
        return
    }
    output.innerHTML += `<div style="align-self: flex-start" id="chatMsg" class="bg-success"> ${data.message}</div>`
    output.scrollTop = output.scrollHeight;
    
});

socket.on('mymsg', data => {
    output.innerHTML += `<div id="chatMsg" class="bg-primary">${data.message}</div>`
    output.scrollTop = output.scrollHeight;
});

socket.on('id', (data) => {
    handler.value = data;
});