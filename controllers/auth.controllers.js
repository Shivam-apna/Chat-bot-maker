const { firebaseApp } = require("../config/firebase");

exports.authentication = (req, res) => {
  res.render("auth");
};

exports.loginWithEmailAndPassword = async (req, res) => {
  const {
    email,
    password
  } = req.body;

  if(!email || !password) {
    return res.render("auth", { error: "Email And Password Is Required." })
  }
  // store in firebase database.
  // Create e
  // const response = await firebaseApp.auth().signInWithEmailAndPassword(email, password);
  // console.log(response)
  return res.send("Login with email and password");
};
