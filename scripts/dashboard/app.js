pdfjsLib.workerSrc = "//mozilla.github.io/pdf.js/build/pdf.worker.js";

function toggleProfileMenu() {
  var menu = document.querySelector("#profile_menu");
  menu.classList.toggle("hidden");
}

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

window.onload = async () => {
  const userInfo = localStorage.getItem("user");
  if (userInfo) {
    const user = JSON.parse(userInfo);
    const providerData = user.providerData[0];
    const userId = providerData.uid;
    window.userId = userId;
    const userRef = await firebase.database().ref("user/" + userId);
    const userExist = await userRef.once("value");
    if (userExist.val()) {
      document
        .getElementById("userImage").innerHTML = providerData?.displayName?.substring(0, 2);
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
      });
    }
  } else {
    // return to auth.
    window.location.href = "/auth";
  }

  const fileUpload = document.getElementById("fileUpload");
  fileUpload.addEventListener("change", async (e) => {
    document.getElementById("loader").classList.toggle("hidden");
    // check if the length of the botData associated with the user is less than 10.
    const botRef = firebase.database().ref("bot/" + window.userId);
    const botRefSnapShot = await botRef.once("value");
    let bot = botRefSnapShot.val();
    if (bot && bot.botData) {
      if (bot.botData.length >= 5) {
        alert("You can only upload 5 files.");
        document.getElementById("loader").classList.toggle("hidden");
    
        return;
      }
    }
    const file = e.target.files[0];

    // file should pdf, doc, docx, csv or txt.
    const formData = new FormData();

    formData.append("pdfFile", file);
    fetch(`/extract-text/${window.userId}`, {
      method: "post",
      body: formData,
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        if (response.success) {
          alert("PDF Uploaded.");
          document.getElementById("fileUploadError").innerHTML = "";
        } else {
          alert("Error uploading PDF.");
          document.getElementById("fileUploadError").innerHTML =
            response.message || "Error uploading PDF.";
        }

        document.getElementById("loader").classList.toggle("hidden");
      });
  });

  // fetch list of items.
  await firebase
    .database()
    .ref("bot/" + userId)
    .child("botData")
    .limitToLast(10)
    .orderByChild("at")
    .on("value", (snapshot) => {
      const data = snapshot.val();

      let botList = document.getElementById("botList");
      botList.innerHTML = "";
      data.forEach((bot) => {
        if (bot.botId) {
          botList.innerHTML = `
          <li key=${bot.botId} class="flex justify-between gap-x-6 py-5">
            <div class="flex gap-x-4 items-center">
                <minidenticon-svg 
                  username="${bot.name}" 
                  class="h-12 w-12 flex-none rounded-full bg-gray-50"
                  style="background-color: #edecff;height: 48px;width: 48px; border-radius: 12%;"
                >
                </minidenticon-svg>
                <div class="min-w-0 flex-auto">
                    <p class="text-lg font-semibold leading-6 text-gray-900">${
                      bot.name
                    }</p>
                    <p class="mt-1 truncate text-sm leading-5 text-gray-500">
                      BOT-${bot.botId}
                    </p>
                    <p class="text-sm leading-6 text-gray-400 italic" style="font-style: italic;">
                      ${getReadableDate(bot.createdAt)}
                    </p>
                </div>
            </div>
            <div class="sm:flex sm:flex-col sm:items-end" style="
            align-items: self-end;
            justify-content: center;
            display: flex;
            flex-direction: column;">
                
                <div class="mt-2 flex items-center text-sm leading-5 text-gray-500 sm:mt-0">

                    <button id="editButton" data-bot-id="${
                      bot.botId
                    }" type="button" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-700 active:bg-indigo-700 transition ease-in-out duration-150">
                        Edit
                    </button>

                  </div>
                  
                  <b class=" leading-6 mt-1 ${
                    bot?.isActive ? "text-green-800" : "text-red-800"
                  }">
                  ${bot?.isActive ? "ACTIVE" : "IN ACTIVE"}
                </b>
            </div>
        </li>
        ` + botList.innerHTML;
        }
      });
    });

  document.getElementById("loader").classList.toggle("hidden");
};

function getReadableDate(date) {
  const d = new Date(date);
  const month = d.toLocaleString("default", { month: "short" });
  const day = d.getDate();
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

$(document).on("click", "#editButton", async function () {
  const botId = $(this).attr("data-bot-id");
  document.getElementById("saveBot").setAttribute("data-bot-id", botId);
  document.getElementById("sidebarLoader").classList.toggle("hidden");
  document.getElementById("rightSideBarBg").classList.remove("hidden");
  document.getElementById("rightSideBarBg").classList.add("fixed");

  document.getElementById("rightSideBar").classList.remove("hidden");
  document.getElementById("rightSideBar").classList.add("fixed");
  const userId = JSON.parse(localStorage.getItem("user")).providerData[0].uid;

  const botRef = firebase.database().ref("bot/" + userId);

  const botData = await botRef.once("value");
  const bot = botData.val().botData.find((bot) => bot?.botId === botId);

  // bot["name"] = ;
  document.getElementById("botName").value = bot.name;
  document.getElementById("openAIKey").value = bot.openAIKey || "";
  document.getElementById("isActive").checked = bot.isActive || false;
  document.getElementById("botId").value = bot.botId || false;
  document.getElementById("userId").value = window.userId;
  document.getElementById("botLogo").innerHTML = `<minidenticon-svg 
  username="${bot.name}" 
  class="h-12 w-12 flex-none rounded-full bg-gray-50"
  style="background-color: #edecff;height: 48px;width: 48px; border-radius: 12%;"
>
</minidenticon-svg>`;

  document.getElementById("sidebarLoader").classList.toggle("hidden");
});

$(document).on("click", "#closeRightSideBar", function () {
  document.getElementById("rightSideBarBg").classList.add("hidden");
  document.getElementById("rightSideBarBg").classList.remove("fixed");

  document.getElementById("rightSideBar").classList.add("hidden");
  document.getElementById("rightSideBar").classList.remove("fixed");
});

$(document).on("click", "#saveBot", async function (e) {
  e.preventDefault();
  // get bot it.
  document.getElementById("sidebarLoader").classList.toggle("hidden");
  const botId = $(this).attr("data-bot-id");
  const userId = JSON.parse(localStorage.getItem("user")).providerData[0].uid;
  const botRef = firebase.database().ref("bot/" + userId);
  let botData = await botRef.once("value");
  botData = botData.val();
  if (botData.botData) {
    botData = botData.botData;
  }
  const bot = botData.find((bot) => bot?.botId === botId);
  bot["name"] = document.getElementById("botName").value;
  bot["openAIKey"] = document.getElementById("openAIKey").value;
  bot["at"] = new Date().getTime();
  bot["updatedAt"] = new Date().toISOString();
  bot["isActive"] = document.getElementById("isActive").checked || false;

  // save bot.
  await botRef.set({
    botData: botData,
  });

  document.getElementById("sidebarLoader").classList.toggle("hidden");
  document.getElementById("rightSideBarBg").classList.add("hidden");
  document.getElementById("rightSideBarBg").classList.remove("fixed");

  document.getElementById("rightSideBar").classList.add("hidden");
  document.getElementById("rightSideBar").classList.remove("fixed");
});
