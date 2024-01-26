const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  ActionRowBuilder,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  name: "confesion",
  description: "Dinos tu confesión",

  callback: async (client, interaction) => {
    try {
      const modal = new ModalBuilder()
        .setCustomId("modalConfesion")
        .setTitle("Confesión");

      const confesionInput = new TextInputBuilder()
        .setCustomId("confesionInput")
        .setLabel("Escribe tu confesion")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("La verdad es que...")
        .setRequired(true);

      const firstActionRow = new ActionRowBuilder().addComponents(
        confesionInput
      );

      modal.addComponents(firstActionRow);

      await interaction.showModal(modal);
    } catch (error) {
      console.error(error);
      await interaction.reply("Hubo un error al procesar el comando.");
    }
  },
};
