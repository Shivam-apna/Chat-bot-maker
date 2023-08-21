

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

const auth = firebase.auth();

window.onload = function () {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    window.location.href = "/dashboard";
  }
};

async function loginWithGoogle() {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const response = await firebase.auth().signInWithPopup(provider);
    localStorage.setItem("user", JSON.stringify(response.user));
    // providerData
    const providerData = response.user.providerData[0];
    
    const userRef = await firebase.database().ref("user/" + providerData.uid);
    const userExist = await userRef.once("value");
    if (userExist.val()) {
    } else {
      userRef.set({
        userId: providerData.uid,
        name: providerData.displayName,
        email: providerData.email,
        phone: providerData.phoneNumber,
        address: "",
        avatar: response.user.photoURL,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        at: new Date().getTime()
      });
    }
    localStorage.setItem("auth", JSON.stringify(response));
    window.location.href = "/dashboard";
  } catch (error) {
    console.log(error);
    alert(error.message);
  }
}
