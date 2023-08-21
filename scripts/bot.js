const HTML = (name) => `
<div class="container" style="z-index: 99999;">
    <div class="chatbox">
        <div class="chatbox__support">
            <div class="chatbox__header">
                <div class="chatbox__content--header">
                    <h4 class="chatbox__heading--header">${name}</h4>
                    <div id="typing" class="typing">Typing...</div>
                </div>
            </div>
            <div class="chatbox__messages">
                <div></div>
            </div>
            <div class="chatbox__footer">
                <input type="text" placeholder="Write a message...">
                <button id="send__button" class="send__button text-indigo-800	">Send</button>
            </div>
        </div>
        <div class="chatbox__button">
            <button>CHAT</button>
        </div>
    </div>
</div>`;

const CSS = `

<style>
/* CHATBOX
=============== */
.typing {
    
    position: absolute;
    text-align: initial;
    color: #861e1e;
    font-size: 14px;
    left: 44%;
    display: none;
    top: 53px;
}
.chatbox {
    position: absolute;
    bottom: 30px;
    right: 30px;
}

/* CONTENT IS CLOSE */
.chatbox__support {
    display: flex;
    flex-direction: column;
    background: #eee;
    width: 300px;
    height: 350px;
    z-index: -123456;
    opacity: 0;
    transition: all .5s ease-in-out;
}

/* CONTENT ISOPEN */
.chatbox--active {
    transform: translateY(-40px);
    z-index: 123456;
    opacity: 1;

}

/* BUTTON */
.chatbox__button {
    text-align: right;
}

.send__button {
    padding: 12px;
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    
    background: rgb(106 101 204 / 60%);
    border-radius: 10px;
    color: white;
    font-weight: 700;
    margin-left: 10px;
}


/* HEADER */
.chatbox__header {
    position: sticky;
    top: 0;
    background: rgb(206 204 241);
}

/* MESSAGES */
.chatbox__messages {
    margin-top: auto;
    display: flex;
    overflow-y: scroll;
    flex-direction: column-reverse;
}

.messages__item {
    max-width: 60.6%;
    width: fit-content;
    
}

.messages__item--operator {
    margin-left: auto;
    
    background: rgb(106 101 204 / 60%) !important;
    color: white !important;
}

.messages__item--visitor {
    margin-right: auto;
}

/* FOOTER */
.chatbox__footer {
    position: sticky;
    bottom: 0;
}

.chatbox__support {
    background: #f9f9f9;
    height: 530px;
    width: 420px;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    border-top-left-radius: 20px;
    background: rgb(240 239 255);
    border-top-right-radius: 20px;
}

/* HEADER */
.chatbox__header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
}

.chatbox__image--header {
    margin-right: 10px;
}

.chatbox__heading--header {
    font-size: 1.2rem;
    color: black;
}

.chatbox__description--header {
    font-size: .9rem;
    color: white;
}

/* Messages */
.chatbox__messages {
    padding: 0 20px;
}

.messages__item {
    margin-top: 10px;
    background: rgb(206 204 241);
    padding: 8px 12px;
    max-width: 70%;
}

.messages__item--visitor,
.messages__item--typing {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
}

.messages__item--operator {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border-bottom-left-radius: 20px;
    background: var(--primary);
    color: black;
}

/* FOOTER */
.chatbox__footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px;
    background: rgb(206 204 241);
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    margin-top: 20px;
}

.chatbox__footer input {
    width: 80%;
    border: none;
    padding: 10px 10px;
    border-radius: 10px;
    text-align: left;
    
    border: 4px solid rgb(106 101 204 / 60%);
}

.chatbox__send--footer {
    color: white;
}

.chatbox__button button,
.chatbox__button button:focus,
.chatbox__button button:visited {
    padding: 10px;
    background: white;
    border: none;
    outline: none;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    border-bottom-left-radius: 50px;
    box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
    cursor: pointer;

    
    background: rgb(106 101 204 / 60%);
    color: white;
    font-weight: bold;
}
</style>    `;

const renderUI = (data) => {
  document.body.insertAdjacentHTML(
    "beforeend",
    HTML(data?.botData?.name || "")
  );
  document.head.insertAdjacentHTML("beforeend", CSS);
};
const API_ENDPOINT = "http://localhost:6513";
const fetchBotInformation = async (userId, botId) => {
  const res = await fetch(`${API_ENDPOINT}/bot/${botId}/user/${userId}`);
  const data = await res.json();
  return data;
};
setTimeout(async () => {
  // Load https://cdn.jsdelivr.net/npm/minidenticons@4.2.0/minidenticons.min.js
  // and then run the following code.\

  // add js to the page.
  const js = document.createElement("script");
  js.src = "https://cdn.jsdelivr.net/npm/minidenticons/minidenticons.min.js";
  document.head.appendChild(js);

  let userId = document
    .querySelector('script[user-id][data-name="quickchatbot"]')
    .getAttribute("user-id");

  let botId = document
    .querySelector('script[bot-id][data-name="quickchatbot"]')
    .getAttribute("bot-id");

  const data = await fetchBotInformation(userId, botId);
  if (data.success === false || data.botData === null) {
    return;
  }
  if (!data?.botData?.isActive) {
    console.warn("Bot is not active");
    return;
  }

  if (!data?.botData?.openAIKey) {
    console.warn("Open AI Key Missing");
    return;
  }

  if (!data.botData?.botId) {
    console.warn("BotId Miss match");
    return;
  }

  localStorage.setItem("messages", JSON.stringify([]));
  localStorage.setItem("messages_chatGPT", JSON.stringify([]));
  renderUI(data);
  const chatbox__button = document.querySelector(".chatbox__button");
  // listener on click.
  chatbox__button.addEventListener("click", () => {
    // toggle class 'chatbox--active'
    document
      .querySelector(".chatbox__support")
      .classList.toggle("chatbox--active");
  });

  document.getElementById("send__button").addEventListener("click", () => {
    var textField = document.querySelector("input");
    let text1 = textField.value;
    if (text1 === "") {
      return;
    }

    textField.value = "";

    document.getElementById("send__button").disabled = true;
    // document.getElementById("typing").style.display = "block";
    document.getElementById("send__button").innerHTML = "...";
    let msg1 = { name: "User", message: text1 };
    let messages = localStorage.getItem("messages")
      ? JSON.parse(localStorage.getItem("messages"))
      : [];
    messages.push(msg1);
    messages.push({
      name: "Sam",
      message: "Typing...",
    });
    let html = "";
    const messageFromLocalStorage =
      localStorage.getItem("messages_chatGPT") || "[]";
    const messagesFromLocalStorage = JSON.parse(messageFromLocalStorage);
    messages
      .slice()
      .reverse()
      .forEach(function (item, index) {
        if (item.name === "Sam") {
          html +=
            '<div class="messages__item messages__item--visitor">' +
            item.message +
            "</div>";
        } else {
          html +=
            '<div class="messages__item messages__item--operator">' +
            item.message +
            "</div>";
        }
      });
    document.querySelector(".chatbox__messages").innerHTML = html;
    if (messagesFromLocalStorage?.length > 0) {
      messagesFromLocalStorage.push({
        role: "user",
        content: text1,
      });
    }
    fetch("http://localhost:6513/askQuestion/" + botId + "/" + userId, {
      method: "POST",
      body: JSON.stringify({
        question: text1,
        messages: messagesFromLocalStorage,
        isConversation: messagesFromLocalStorage?.length > 0,
      }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((r) => {
        messages.pop();
        localStorage.setItem("messages_chatGPT", JSON.stringify(r?.messages));
        let msg2 = {
          name: "Sam",
          message: r.answer || r?.message || "Something went Wrong.",
        };
        if (r?.error) {
          console.warn(r.error);
          console.warn("PLEASE CONTACT ADMIN");
        }
        messages.push(msg2);
        localStorage.setItem("messages", JSON.stringify(messages));
        textField.value = "";

        const chatmessage = document.querySelector(".chatbox__messages");
        var html = "";
        messages
          .slice()
          .reverse()
          .forEach(function (item, index) {
            if (item.name === "Sam") {
              html +=
                '<div class="messages__item messages__item--visitor">' +
                item.message +
                "</div>";
            } else {
              html +=
                '<div class="messages__item messages__item--operator">' +
                item.message +
                "</div>";
            }
          });
        chatmessage.innerHTML = html;
        document.getElementById("send__button").disabled = false;
        document.getElementById("send__button").innerHTML = "Send";
        document.getElementById("typing").style.display = "none";
      })
      .catch((error) => {
        console.error("Error:", error);
        document.getElementById("typing").style.display = "none";
        textField.value = "";
      });
  });
}, 150);
