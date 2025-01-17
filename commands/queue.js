const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Ver las 10 primeras canciones de la cola de reproducción'),
    execute: async ({ client, interaction }) => {
        const queue = useQueue(interaction.guild);

        if (!queue) {
            await interaction.reply("No hay canciones reproduciendo.");
            return;
        }

        if (!queue.tracks.toArray()[0]) {
            await interaction.reply("No hay canciones en la cola de reproducción.");
            return;
        }

        if (!queue.currentTrack) {
            await interaction.reply("No hay una canción reproduciéndose actualmente.");
            return;
        }
        const songs = queue.tracks.size;
        const nextSongs = songs > 5 ? await `Y **${songs - 5}** cancion(es) más...` : await `En la playlist **${songs}** cancion(es)...`;
        const tracks = queue.tracks.map((track, i) => `**${i + 1}** - ${track.title} | ${track.author}`);
        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle('Cola de Reproducción')
            .setDescription(`**Reproduciendo ahora:**\n${queue.currentTrack.title} - ${queue.currentTrack.author}\n\n**Siguientes canciones:**\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`)
            ;
        interaction.reply({ embeds: [embed] });
    }
};