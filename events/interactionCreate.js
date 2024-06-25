const {Events} = require('discord.js');

// Interaction Create Event Listener
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return; // Ensure that only slash commands are handled
        console.log(interaction);

        // Get current interacted/called slash command
        const command = interaction.client.commands.get(interaction.commandName); 
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        // Try calling the command through its execute property/method
        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
};