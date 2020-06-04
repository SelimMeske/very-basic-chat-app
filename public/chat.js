let socket = io();

let button = document.getElementById('button');
let output = document.getElementById('output');
let message = document.getElementById('message');
let partner = document.getElementById('partner');
let idButton = document.getElementById('uniqueId');

function clearMessageInput() {
    message.value = '';
}

let userId = '';

function emitMsg() { socket.emit('chat', {
    message: message.value,
    partner: partner.value
})
}

idButton.addEventListener('click', () => {

    navigator.permissions.query({ name: "clipboard-write" }).then(result => {
        if (result.state == "granted" || result.state == "prompt") {
            navigator.clipboard.writeText(userId).then(function () {
                idButton.innerText = 'ID copied!';
                idButton.classList.add('bg-warning');
                setTimeout(()=>{
                    idButton.innerText = 'Copy ID';
                    idButton.classList.remove('bg-warning');
                }, 2000)
            }, function () {
                /**on error */
            });
        }
    });
});

button.addEventListener('click', () => {
    let myMsg = message.value;
    if(!myMsg){
        return;
    }
    emitMsg();
    clearMessageInput();
});

document.addEventListener('keypress', (e) => {
    let myMsg = message.value;
    if(!myMsg){
        return
    }
    let key = e.which;
    if(key === 13){
        emitMsg();
        clearMessageInput();
    }
});

socket.on('chat', (data) => {
    
    output.innerHTML += `<div style="align-self: flex-start" id="chatMsg" class="bg-success"> ${data.message}</div>`
    output.scrollTop = output.scrollHeight;
    
});

socket.on('mymsg', data => {
    output.innerHTML += `<div id="chatMsg" class="bg-primary">${data.message}</div>`
    output.scrollTop = output.scrollHeight;
});

socket.on('id', (data) => {
    userId = data;
});