const { database } = require("../config/firebase");

exports.getUserInfo = async (req, res) => {
  const { userId } = req.params;
  var userRef = database().ref("user/" + userId);
  const userSnapshot = await userRef.once("value");
  let user = userSnapshot.val();
  if (!user) {
    // Create new user
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }
};

exports.createUserInfoIfUserIdNotExists = async (req, res) => {
  const { userId } = req.params;
  var userRef = database().ref("user/" + userId);
  const userSnapshot = await userRef.once("value");
  let user = userSnapshot.val();
  if (!user) {
    // Create new user
    await userRef.set({
      userId,
      name: "",
      email: "",
      phone: "",
      address: "",
      avatar: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return res.status(200).json({
    success: true,
    message: "User created successfully",
  });
};
