require("dotenv").config();
const { REST, Routes } = require("discord.js");

const commands = [
  {
    name: "titi",
    description: "Saluda como Titi",
    type: 1,
  },
  {
    name: "anuncio",
    description: "Emite anuncios en el server",
    options: [
      {
        type: 3,
        name: "nombre",
        description: "Escribe el nombre del anuncio",
        required: true,
      },
    ],
    type: 1,
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(
      Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID),
      { body: commands }
    );

    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }
})();
