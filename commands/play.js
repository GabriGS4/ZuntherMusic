const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { QueryType, useMainPlayer, useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Reproducir una canción')
        .addStringOption(option =>
            option.setName('play')
                .setDescription('El nombre o URL de la canción')
                .setRequired(true)),
    execute: async ({ client, interaction }) => {
        if (!interaction.member.voice.channel) {
            await interaction.reply('¡Debes unirte a un canal de voz primero!');
            return;
        }

        const player = useMainPlayer();
        const queue = useQueue(interaction.guild);

        let embed = new EmbedBuilder().setColor('#2f3136');
        let song = interaction.options.getString("play");

        const res = await player.search(song, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });

        if (!res?.tracks.length) {
            await interaction.reply("No encontré la canción. Intenta con otro nombre o enlace.");
            return;
        }

        try {
            if (queue?.isPlaying()) {
                const track = res.tracks[0];
                queue.insertTrack(track, 0);
                embed
                    .setTitle("Canción añadida a la cola")
                    .setDescription("" + track.title + " \n" + track.url)
                    .setThumbnail(track.thumbnail)
                    .setFooter({ text: track.duration });
            } else {
                const { track } = await player.play(interaction.member.voice.channel, song);
                embed
                    .setDescription("" + track.title + " \n" + track.url)
                    .setThumbnail(track.thumbnail)
                    .setFooter({ text: track.duration });
            }
        } catch (error) {
            embed.setAuthor("Error al reproducir la canción.");
            await interaction.reply({ embeds: [embed] });
            return;
        }

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