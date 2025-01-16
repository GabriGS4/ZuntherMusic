const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('exit')
        .setDescription('Salir del canal de voz'),
    execute: async ({ client, interaction }) => {
        const queue = useQueue(interaction.guild);

        if (!queue?.isPlaying()) {
            await interaction.reply("No hay canciones reproduciendo.");
            return;
        }

        queue.delete();

        await interaction.reply("Saliendo del canal de voz.");

    }
};