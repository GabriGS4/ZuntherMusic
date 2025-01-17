const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { useQueue } = require('discord-player');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('back')
        .setDescription('Volver a la canción anterior'),
    execute: async ({ client, interaction }) => {
        const queue = useQueue(interaction.guild);

        if (!queue?.isPlaying()) {
            await interaction.reply("No hay canciones reproduciendo.");
            return;
        }

        if (!queue.history.previousTrack) {
            await interaction.reply("No hay canciones anteriores.");
            return;
        }

        // Volvemos a la canción anterior
        await queue.history.back();

        await new Promise(resolve => setTimeout(resolve, 500));

        const track = queue.currentTrack;

        if (!track) {
            await interaction.reply("La cola está vacía después de volver.");
            return;
        }

        let embed = new EmbedBuilder().setColor('#2f3136');
        embed
            .setTitle("Canción anterior\nReproduciendo...")
            .setDescription(`**${track.title}**\n${track.url}`)
            .setFooter({ text: track.duration })
            .setThumbnail(track.thumbnail);


        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('back')
                    .setEmoji('⏮️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('pause')
                    .setEmoji('⏸️')
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