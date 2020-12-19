//const fetch = require("node-fetch");
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot("1373145412:AAG7OeGNQE1-4AHore4nGRPQI9aHhfNnduw", {
  polling: true,
});
const request = require("request");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

bot.onText(/\/plant (.+)/, (msg, match) => {
  let plant = match[1];
  let chatId = msg.chat.id;
  request(
    `https://trefle.io/api/v1/species/search?token=YrWtVX-fUjuH-ISKU7_TnjOsKMZMG56EmJrlqGllANs&q=${plant}`,
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        bot
          .sendMessage(chatId, `_We're looking for ${plant}..._`, {
            parse_mode: "Markdown",
          })
          .then((msg) => {
            let res = JSON.parse(body);
            bot
              .sendPhoto(chatId, res.data[0].image_url, {
                caption:
                  res.data[0].scientific_name +
                  "\nAlso know as " +
                  res.data[0].common_name +
                  ", it is a part of the " +
                  res.data[0].family_common_name +
                  "." +
                  "\nThere are " +
                  res.meta.total +
                  " other plants under this name. Maybe you might also be looking for " +
                  res.data[1].common_name +
                  "?",
              })
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

app.listen(port, function () {
  console.log(`Server is up on port ${port}`);
});
