const config = {
  apiKey: "AIzaSyCUGO9UXmQnuqZ5R55EcYfD7peW5dGcNtE",
  authDomain: "quick-chat-bot-ai.firebaseapp.com",
  databaseURL: "https://quick-chat-bot-ai-default-rtdb.firebaseio.com",
  projectId: "quick-chat-bot-ai",
  storageBucket: "quick-chat-bot-ai.appspot.com",
  messagingSenderId: "645302832078",
  appId: "1:645302832078:web:a91ddd9d5c3632cddd399f",
  measurementId: "G-G3E7SSW9D4",
};

firebase.initializeApp(config);
window.onload = async () => {
  const userInfo = localStorage.getItem("user");
  if (userInfo) {
    const user = JSON.parse(userInfo);
    const providerData = user.providerData[0];
    const userId = providerData.uid;
    window.userId = userId;
    if (providerData && providerData.displayName) {
      document.getElementById("authIcon").classList.toggle("hidden");
    } else {
      document.getElementById("loginButton").classList.remove("hidden");
    }
    document.getElementById("userImage").innerHTML =
      providerData?.displayName?.substring(0, 2);
  } else {
    document.getElementById("loginButton").classList.remove("hidden");
  }
};

function toggleProfileMenu() {
  var menu = document.querySelector("#profile_menu");
  menu.classList.toggle("hidden");
}

function signOut() {
  firebase
    .auth()
    .signOut()
    .then(function () {
      localStorage.removeItem("user");
      window.location.href = "/auth";
    })
    .catch(function (error) {
      console.log(error);
    });
}
