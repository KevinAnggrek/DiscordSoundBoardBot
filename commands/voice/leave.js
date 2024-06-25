const {SlashCommandBuilder} = require('discord.js');
const {getVoiceConnection} = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('I will leave the voice channel'),
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guild.id)
        if (connection) {
            connection.destroy();
            await interaction.reply('I will leave the voice channel now! See you around!');
        }
        else {
            await interaction.reply("I'm not in a voice channel!");
        }
    }
};