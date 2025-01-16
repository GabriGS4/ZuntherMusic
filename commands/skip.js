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