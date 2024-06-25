const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Invites me to join the voice channel'),
    async execute(interaction) {
        if (interaction.member.voice.channel)  {// if the guild member who called the interaction is inside a voice channel
            const connection = joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator
            });
            await interaction.reply('Joined the voice channel!');
        }
        else {
            await interaction.reply('You need to join a voice channel first before you can invite me!')
        }
    }
}