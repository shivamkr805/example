const TelegramBot = require('node-telegram-bot-api');

// Replace with your Telegram bot token
const token = '6320118851:AAF0S7uwLZbW4MJLD8rki0snQOxWSMP8_fw';

// Create a bot using polling to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Handle the /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.chat.first_name || 'there';

  bot.sendMessage(chatId, `Hello ${name}! Welcome to the upgraded bot. How can I assist you?`);
});

// Handle the /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Here are some commands you can use:\n\n/start - Start the bot\n/help - Get a list of commands\n/echo - Echo your message back\n/quiz - Take a simple quiz');
});

// Handle the /echo command
bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1]; // the captured message
  bot.sendMessage(chatId, `You said: ${resp}`);
});

// Handle the /quiz command to offer an inline keyboard
bot.onText(/\/quiz/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'What is the capital of France?', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Paris', callback_data: 'correct' },
          { text: 'London', callback_data: 'wrong' },
          { text: 'Berlin', callback_data: 'wrong' }
        ]
      ]
    }
  });
});

// Handle callback data from inline keyboard (for the quiz)
bot.on('callback_query', (callbackQuery) => {
  const message = callbackQuery.message;
  const data = callbackQuery.data;

  if (data === 'correct') {
    bot.sendMessage(message.chat.id, 'Correct! 🎉');
  } else {
    bot.sendMessage(message.chat.id, 'Oops, that’s wrong. 😞');
  }

  // Optionally, remove the inline keyboard after the answer
  bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: message.chat.id, message_id: message.message_id });
});

// Listen for any other message
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.toLowerCase();

  if (text === 'hi' || text === 'hello') {
    bot.sendMessage(chatId, `Hello! How are you doing today?`);
  } else if (text === 'bye') {
    bot.sendMessage(chatId, `Goodbye! Have a great day!`);
  } else {
    bot.sendMessage(chatId, `I'm not sure how to respond to that. Type /help for available commands.`);
  }
});
