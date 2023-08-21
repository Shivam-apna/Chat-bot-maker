require("./config/firebase");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const pdfParse = require("pdf-parse");
const {
  authRoutes,
  dashboardRoutes,
  userRoutes,
  integrationRoutes,
} = require("./routes");
const firebase = require("./config/firebase");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 6513;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("scripts"));
app.use(express.static("public"));

app.use(fileUpload());
app.set("view engine", "ejs");

// serve bot.js script file.
app.use("/bot.js", express.static(__dirname + "/scripts/bot.js"));

app.use("/auth", authRoutes);

app.use("/dashboard", dashboardRoutes);

app.use("/user", userRoutes);

app.use("/integration", integrationRoutes);

app.post("/extract-text/:userId", (req, res) => {
  if (!req.files && !req.files.pdfFile) {
    res.status(400);
    res.end();
  }

  pdfParse(req.files.pdfFile).then(async (result) => {
    result.text = result.text.replace(/(\r\n|\n|\r)/gm, " ");
    result.text = result.text.trim();
    if (result.text && result.text.length >= 74000) {
      return res.status(400).json({
        message: "File size is too large.",
        success: false,
      });
    }

    const botRef = firebase.database().ref("bot/" + req.params.userId);
    const botId = Math.random().toString(36).substring(2, 15);
    const botRefSnapShot = await botRef.once("value");
    let bot = botRefSnapShot.val();
    if (!bot) {
      // Create new user
      await botRef.set({
        userId: req.params.userId,
        botData: [
          {
            data: result.text,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            name: "Bot 1",
            botId,
          },
        ],
      });
      return res.status(201).json({
        message: "File uploaded successfully.",
        success: true,
      });
    }

    bot.botData.push({
      data: result.text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: `Bot ${bot.botData.length + 1}`,
      botId,
    });

    await botRef.set(bot);

    return res.status(201).json({
      message: "File uploaded successfully.",
      success: true,
    });
  });
});

app.post("/askQuestion/:botId/:userId", async (req, res) => {
  const botRef = firebase.database().ref("bot/" + req.params.userId);
  const botRefSnapShot = await botRef.once("value");
  let bot = botRefSnapShot.val();
  if (!bot) {
    return res.status(400).json({
      message: "No bot found for the user.",
      success: false,
    });
  }

  const botData = bot.botData.find((bot) => bot.botId === req.params.botId);
  if (!botData) {
    return res.status(400).json({
      message: "No bot found for the user.",
      success: false,
    });
  }

  let pdfContent = botData.data;

  if (!pdfContent || !botData.openAIKey) {
    return res.status(400).json({
      message: !botData.openAIKey
        ? "No Open AI Key Found"
        : "No Active Bot Found.",
      success: false,
    });
  }

  // trim all the new lines.
  pdfContent = pdfContent.replace(/\n/g, " ");

  // Truncate the content to 74311 characters.
  pdfContent = pdfContent.substring(0, 74000);

  const isConversation = req.body.isConversation || false;

  const payload = {
    model: "gpt-3.5-turbo-16k",
    messages: !isConversation
      ? [
        {
          role: "system",
          content: `
                      Content: 
                      "${pdfContent}"
                  `,
        },
        {
          role: "user",
          content: `
                  Please figure out the answer for the below Question. Answer should be strictly from the Content shared earlier.
                  If it is a general question, please answer it "Oh dear. That doesn't sound like something I can help with here. Can you please email our team at info@aapnainfotech.com.".

                  Question:
                  ${req.body.question}
              `,
        },
      ]
      : req.body.messages,
    // "top_p": 1,
    temperature: 0.5,
  };

  axios
    .post("https://api.openai.com/v1/chat/completions", payload, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${botData.openAIKey}`,
      },
    })
    .then((response) => {
      let { messages } = req.body;
      if (!messages || messages.length === 0) {
        messages = [
          {
            role: "system",
            content: `
                      Content: 
                      "${pdfContent}"
                  `,
          },
          {
            role: "user",
            content: `
                  Please figure out the answer for the below Question. Answer should be strictly from the Content shared earlier.
                  If it is a general question, please answer it "Oh dear. That doesn't sound like something I can help with here. Can you please email our team at info@aapnainfotech.com."

                  Question:
                  ${req.body.question}
              `,
          },
        ]
      }
      // push the new message to the messages array.
      messages.push(response?.data?.choices[0]?.message);
      const ans = response?.data?.choices[0]?.message?.content || "";
      return res.json({
        answer: ans,
        messages,
      });
    })
    .catch((error) => {
      console.log(error)
      return res.json(error.response?.data || {});
    });
});

app.get("/bot/:botId/user/:userId", async (req, res) => {
  const botRef = firebase.database().ref("bot/" + req.params.userId);
  const botRefSnapShot = await botRef.once("value");
  let bot = botRefSnapShot.val();
  if (!bot) {
    return res.status(400).json({
      message: "No bot found for the user.",
      success: false,
    });
  }

  const botData = bot.botData.find((bot) => bot.botId === req.params.botId);
  if (!botData) {
    return res.status(400).json({
      message: "No bot found for the user.",
      success: false,
    });
  }

  return res.json({
    botData,
    success: true,
  });
});

app.get("*", (req, res) => {
  // redirect to "/Integration".

  return res.redirect("/integration");
});

app.listen(PORT, () =>
  console.log(`The app start on http://localhost:${PORT}`)
);
