const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Renaudar la canción'),
    execute: async ({ client, interaction }) => {
        const queue = useQueue(interaction.guild);

        if (queue.node.isPlaying()) {
            await interaction.reply("No hay canciones reproduciendo.");
            return;
        }

        const success = queue.node.resume();

        if (!success) {
            await interaction.reply("No se pudo reanudar la canción.");
            return;
        }
        const currentTrack = queue.currentTrack;

        let embed = new EmbedBuilder().setColor('#2f3136');

        embed
            .setTitle("Canción reanudada")
            .setDescription(`**${currentTrack.title}**\n${currentTrack.url}`)
            .setThumbnail(currentTrack.thumbnail);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('pause')
                    .setLabel('Pausar')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('skip')
                    .setLabel('Saltar')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('exit')
                    .setLabel('Detener')
                    .setStyle(ButtonStyle.Danger)
            );

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
};