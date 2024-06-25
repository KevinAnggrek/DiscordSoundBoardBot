const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const {Client, Collection, GatewayIntentBits} = require('discord.js');
const {joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus} = require('@discordjs/voice');

dotenv.config()

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Create Command Handler: Load all slash commands from the commands folder to the commands Collection/Map of the Client
client.commands = new Collection();

const commandFoldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandFoldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(commandFoldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command); // key = command name, value = the command itself
        }
        else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Create Event Handler: Load all Event Listeners from the events folder
const eventPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventPath, file);
    const event = require(filePath);
    if(event.once) {
        client.once(event.name, (...args) => event.execute(...args)); // Each event contains a name property which is the event that will be listened to. Once the event is triggered, call the execute method of the event listener
    }
    else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(process.env.DISCORD_TOKEN);
