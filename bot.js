const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot("1373145412:AAG7OeGNQE1-4AHore4nGRPQI9aHhfNnduw", {
  polling: true, // receiving messages
});
const request = require("request"); // for HTTP requestsbot.js
const trefleToken = "YrWtVX-fUjuH-ISKU7_TnjOsKMZMG56EmJrlqGllANs";

// syntax /search "some plant"
bot.onText(/\/search (.+)/, (msg, match) => {
  let plant = match[1]; // match "some plant"
  let chatId = msg.chat.id; // telegram message
  request(
    `https://trefle.io/api/v1/species/search?token=${trefleToken}&q=${plant}`,
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        // request succeeded
        bot
          // set up promise
          .sendMessage(chatId, `_We're looking for ${plant}..._`, {
            parse_mode: "Markdown", // for italics
          })
          .then((msg) => {
            let res = JSON.parse(body); // convert received data (string) a JSON object
            bot
              // Set up picture & caption from query
              .sendPhoto(chatId, res.data[0].image_url, {
                caption: `${res.data[0].scientific_name} \nAlso know as ${res.data[0].common_name}, it is a part of the ${res.data[0].family} family. Its name was first published in ${res.data[0].year}.\nThere are ${res.meta.total} other plants under this name. Maybe you might also be looking for ${res.data[1].common_name}/${res.data[1].scientific_name}?`,
              })
              // Error message when there's no match for "some plant"
              .catch((err) => {
                if (err) {
                  bot.sendMessage(chatId, "Plant not found, please try again!");
                }
              });
          });
      }
    }
  );
});
