const keep_alive = require("./keep_alive.js")

require("dotenv").config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, Collection } = require("discord.js");
const { Player } = require("discord-player");
const { YoutubeiExtractor } = require("discord-player-youtubei");
//const { SpotifyExtractor } = require('@discord-player/extractor');
const { SpotifyExtractor } = require('@discord-player/extractor');
//const ytdl = require('ytdl-core');

const playdl = require('play-dl');

const fs = require("node:fs");
const path = require("node:path");

// Crear cliente de Discord
const client = new Client({
    intents: 53608447,
});

// Registrar comandos y botones
const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

// Configuración del reproductor
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
    },
});


client.player.extractors.register(YoutubeiExtractor, {});
//client.player.extractors.loadMulti(DefaultExtractors);
/*client.player.extractors.register(SpotifyExtractor, {
    clientId: "83dd5e2507d342dcb8dc152e21dab8ea",
    clientSecret: "050407e96aa24e61a8a631a6a41b1811",
});*/

//client.player.extractors.register(playdl);

// Registrar comandos en los servidores
client.on("ready", () => {
    const guild_ids = client.guilds.cache.map(guild => guild.id);

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
    for (const guild_id of guild_ids) {
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guild_id), {
            body: commands,
        })
            .then(() => console.log(`Comandos registrados en el servidor ${guild_id}`))
            .catch(console.error);
    }
});

// Manejar interacciones
client.on("interactionCreate", async interaction => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute({ client, interaction });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "Ocurrió un error al ejecutar el comando.", ephemeral: true });
        }
    } else if (interaction.isButton()) {
        const command = client.commands.get(interaction.customId);
        if (!command) {
            await interaction.reply({ content: "Acción desconocida.", ephemeral: true });
            return;
        }

        try {
            await command.execute({ client, interaction });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "Ocurrió un error al manejar el botón.", ephemeral: true });
        }
    }
});

// Iniciar cliente de Discord
client.login(process.env.TOKEN);
