const {Events} = require('discord.js');

// Client Logged-in Event Listener
module.exports = {
    name: Events.ClientReady,
    once:true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`)
    }
};