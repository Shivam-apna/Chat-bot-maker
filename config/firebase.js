// // Import the functions you need from the SDKs you need
// const { initializeApp } = require("firebase-admin/app");

// const firebaseConfig = {
//     apiKey: "AIzaSyCUGO9UXmQnuqZ5R55EcYfD7peW5dGcNtE",
//     authDomain: "quick-chat-bot-ai.firebaseapp.com",
//     databaseURL: "https://quick-chat-bot-ai-default-rtdb.firebaseio.com",
//     projectId: "quick-chat-bot-ai",
//     storageBucket: "quick-chat-bot-ai.appspot.com",
//     messagingSenderId: "645302832078",
//     appId: "1:645302832078:web:a91ddd9d5c3632cddd399f",
//     measurementId: "G-G3E7SSW9D4"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// module.exports = {
//     firebaseApp: app
// };

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://quick-chat-bot-ai-default-rtdb.firebaseio.com",
});

module.exports = {
  database: admin.database,
};
