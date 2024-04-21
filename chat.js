const firebaseConfig = {
    apiKey: "AIzaSyBMQGenx2wFoh-GB7EAnKZq25_65C7SFzY",
    authDomain: "chatroom-8e41c.firebaseapp.com",
    databaseURL: "https://chatroom-8e41c-default-rtdb.firebaseio.com",
    projectId: "chatroom-8e41c",
    storageBucket: "chatroom-8e41c.appspot.com",
    messagingSenderId: "261455953020",
    appId: "1:261455953020:web:a29935e7a0df1eabdd9df9",
    measurementId: "G-JF1SNDMCS7"
};
firebase.initializeApp(firebaseConfig);

const chatContain = document.getElementById('chat_contain');
const loginContain = document.getElementById('login');
const googleButton = document.getElementById('google_button');

const googleProvider = new firebase.auth.GoogleAuthProvider();

googleButton.addEventListener('click', () => {
    firebase.auth().signInWithPopup(googleProvider)
        .then((result) => {
            const user = result.user;
            console.log('Logged in as: ', user.displayName);
            chatContain.style.display = 'block';
            loginContain.style.display = 'none';
        })
        .catch((error) => {
            console.error('Google sign-in error:', error);
        });
});

window.msgSend = function () {
    const userInput = document.getElementById('user').value;

    if (userInput !== '') {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
            const senderName = currentUser.displayName;
            const senderPhotoURL = currentUser.photoURL;
            firebase.database().ref('messages').push({
                sender: senderName,
                senderPhoto: senderPhotoURL,
                message: userInput,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
            document.getElementById('user').value = '';
        } else {
            console.error('not logged in.');
        }
    }
}

function displayInput(sender, message) {
    const msgElement = document.createElement('div');
    msgElement.classList.add('message');
    msgElement.innerText = message;
    if (sender === 'user') {
        msg.classList.add('user_msg');
    } else {
        msgElement.classList.add('bot_msg');
    }
    chatMsg.appendChild(msgElement);
    chatMsg.scrollTop = chatMessages.scrollHeight;
}

firebase.database().ref('messages').orderByChild('timestamp').on('child_added', function (snapshot) {
    const msgData = snapshot.val();
    displayInput(msgData.sender, msgData.message);
});

firebase.database().ref('messages').on('child_added', function (snapshot) {
    const msgData = snapshot.val();
    if (msgData.sender !== 'user') {
        displayInput(msgData.sender, msgData.message);
    }
});