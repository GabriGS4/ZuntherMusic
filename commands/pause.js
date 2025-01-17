const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pausar la canción'),
    execute: async ({ client, interaction }) => {
        const queue = useQueue(interaction.guild);

        if (!queue?.isPlaying()) {
            await interaction.reply("No hay canciones reproduciendo.");
            return;
        }

        if (queue.node.isPaused()) {
            return interaction.reply("La canción ya está pausada.");
        }

        const success = queue.node.setPaused(true);

        if (!success) {
            await interaction.reply("No se pudo pausar la canción.");
            return;
        }

        const currentTrack = queue.currentTrack;

        let embed = new EmbedBuilder().setColor('#2f3136');

        embed
            .setTitle("Canción pausada")
            .setDescription(`**${currentTrack.title}**\n${currentTrack.url}`)
            .setThumbnail(currentTrack.thumbnail);


        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('back')
                    .setEmoji('⏮️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('resume')
                    .setEmoji('▶️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('skip')
                    .setEmoji('⏭️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('exit')
                    .setEmoji('⏹️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('queue')
                    .setEmoji('📜')
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
};