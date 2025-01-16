const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Ver las 10 primeras canciones de la cola de reproducción'),
    execute: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guild);

        if (!queue || !queue.playing) {
            await interaction.reply("No hay canciones reproduciendo.");
            return;
        }

        const queueString = queue.tracks.map((track, i) => {
            return `${i + 1}. **${track.title}**`;
        }).slice(0, 10).join('\n');

        const currentSong = queue.current;

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Cola de reproducción")
                    .setDescription("**Canción reproduciendo:**\n" + `**${currentSong.title}**\n\n**Siguientes canciones:**\n${queueString}`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        });
    }
};