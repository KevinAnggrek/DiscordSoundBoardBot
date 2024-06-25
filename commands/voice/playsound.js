const path = require('node:path');
const {SlashCommandBuilder} = require('discord.js');
const {createAudioPlayer, createAudioResource, joinVoiceChannel, getVoiceConnection, generateDependencyReport, VoiceConnectionStatus} = require('@discordjs/voice');
const audioMap = require('../../src/audioMap.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playsound')
        .setDescription('Plays an audio file in the voice channel')
        .addStringOption(option =>
            option.setName('keyword')
                .setDescription('The keyword for the audio file')
                .setRequired(true)),
    async execute(interaction) {
        try {
            // Log the Dependency Report
            console.log(generateDependencyReport());

            // Get the keyword for the audio file from the string options/parameters passed to the slash command
            const keyword = interaction.options.getString('keyword');

            // Find audio file based on audio file mapping
            const audioFilePath = audioMap[keyword];

            if (!audioFilePath) {
                await interaction.reply(`No audio file found for keyword: ${keyword}`);
                return;
            }

            
            // Get the current Voice Channel where interaction occured
            const voiceChannel = interaction.member.voice.channel;

            if (voiceChannel) {
                // fetch current connection
                let connection = getVoiceConnection(voiceChannel.guild.id);
                // if the bot is not in the voice channel, let it join first
                if (!connection) {
                    connection = joinVoiceChannel({
                        channelId: voiceChannel.id,
                        guildId: interaction.guild.id,
                        adapterCreator: interaction.guild.voiceAdapterCreator,
                    });
                }

                // Create Audio Player instance
                const player = createAudioPlayer();
                //const resourcePath = 'C:/projects/DiscordSoundboardBotJs/resources/audio/ara-ara.mp3';
                const resource = createAudioResource(audioFilePath);

                connection.subscribe(player);
                player.play(resource);

                player.on('playing', () => {
                    console.log('Playing the audio file...');
                });

                player.on('idle', () => {
                    console.log('The audio file has finished playing!');
                });

                player.on('error', error => {
                    console.error('Error:', error.message);
                });

                await interaction.reply('Playing ara-ara sound!');
            }
            else {
                await interaction.reply('You need to invite me to join a voice channel first!')
            }
        }
        catch (error) {
            console.error('Error executing play command:', error);
            await interaction.reply('An error occurred while trying to play the audio');
        }
    }
}