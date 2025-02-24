const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { useQueue } = require('discord-player');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Saltar a la siguiente canción'),
    execute: async ({ client, interaction }) => {
        const queue = useQueue(interaction.guild);

        if (!queue?.isPlaying()) {
            await interaction.reply("No hay canciones reproduciendo.");
            return;
        }

        const success = queue.node.skip();

        if (!success) {
            await interaction.reply("No se pudo saltar la canción.");
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        const track = queue.currentTrack;

        if (!track) {
            await interaction.reply("La cola está vacía después de saltar la canción.");
            return;
        }

        let embed = new EmbedBuilder().setColor('#2f3136');
        embed
            .setTitle("Canción saltada\nReproduciendo...")
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