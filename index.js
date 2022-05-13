require('dotenv').config();
const { Client, Intents } = require('discord.js');
const ExpertSystem = require('./expert-system/system');
const { table, stateMessages, helpMessages } = require('./expert-system/data');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const system = new ExpertSystem(table, stateMessages, helpMessages);

client.on('ready', () => console.log(`Logged in as ${client.user.tag}`));

client.on('messageCreate', (message) => {
    const { content, channel} = message;

    if ((content === '!start' && system.state === -1)
        || (content === '!restart' && system.state !== -1)) {
        system.start();

        const startQuestion = system.getStartQuestion();

        if (startQuestion) {
            channel.send(startQuestion);
        }

        return;
    }

    const answer = content === '!help' && system.helpState !== -1 ? system.getHelp() : system.process(content);

    if (answer) {
        channel.send(answer);
    }
})

client.login(process.env.TOKEN);