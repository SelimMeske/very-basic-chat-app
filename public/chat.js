window.addEventListener('load', () => {
    let loader = document.getElementById('loader');
    loader.style.opacity = 0;

    /**Remove loader after 1,1sec */
    setTimeout(() => {
        loader.style.display = 'none';
    }, 1100);
});

window.addEventListener('DOMContentLoaded', () => {
    let socket = io();

    let button = document.getElementById('button'),
        output = document.getElementById('output'),
        message = document.getElementById('message'),
        partner = document.getElementById('partner'),
        idButton = document.getElementById('uniqueId'),
        idField = document.getElementById('idField'),
        newMsgSound = document.getElementById('newMsg'),
        startChat = document.getElementById('startChat');

    function clearMessageInput() {
        message.value = '';
    }

    let userId = '';

    function emitMsg() {
        socket.emit('chat', {
            message: message.value,
            partner: partner.value
        })
    }

    /**Copy ID to clipboard on buttonclick */
    idButton.addEventListener('click', () => {

        navigator.permissions.query({ name: "clipboard-write" }).then(result => {
            if (result.state == "granted" || result.state == "prompt") {
                navigator.clipboard.writeText(userId).then(function () {
                    idButton.innerText = 'ID copied!';
                    idButton.classList.add('bg-warning');
                    setTimeout(() => {
                        idButton.innerText = 'Copy ID';
                        idButton.classList.remove('bg-warning');
                    }, 2000)
                }, function () {
                    /**on error */
                });
            }
        });
    });

    /**Enter chat on button click */
    startChat.addEventListener('click', () => {
        let idGen = document.getElementById('idGen'),
            idGenGroup = document.getElementById('idGenGroup');
        idGen.classList.add('startAni');
        idGenGroup.style.opacity = 0;
        document.getElementById('main').style.visibility = 'visible';
    });

    /**Send message */
    button.addEventListener('click', () => {
        let myMsg = message.value;
        if (!myMsg) {
            return;
        }
        emitMsg();
        clearMessageInput();
    });

    /**Send message on keypress */
    document.addEventListener('keypress', (e) => {
        let myMsg = message.value;
        if (!myMsg) {
            return
        }
        let key = e.which;
        if (key === 13) {
            emitMsg();
            clearMessageInput();
        }
    });

    socket.on('chat', (data) => {
        newMsgSound.play();
        output.innerHTML += `<div style="align-self: flex-start" id="chatMsg" class="bg-success"> ${data.message}</div>`
        output.scrollTop = output.scrollHeight;

    });

    socket.on('mymsg', data => {

        output.innerHTML += `<div id="chatMsg" class="bg-primary">${data.message}</div>`
        output.scrollTop = output.scrollHeight;
    });

    socket.on('id', (data) => {
        userId = data;
        idField.value = data;
    });

    socket.on('broadcast', data => {
        output.innerHTML += `<i style="color:white;">${data}</i>`
    });
});
