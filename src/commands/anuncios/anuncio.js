const fs = require("fs");
const path = require("path");
const {
  MessageAttachment,
  PermissionFlagsBits,
  ActionRowBuilder,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const anunciosFilePath = path.join(__dirname, "../../data/anuncios.json");

function readAnuncios() {
  try {
    const anunciosData = fs.readFileSync(anunciosFilePath, "utf8");
    return JSON.parse(anunciosData);
  } catch (error) {
    console.error("Error al leer el archivo de anuncios:", error);
    return [];
  }
}

const anuncios = readAnuncios();

function generateChoices() {
  return anuncios.map((anuncio) => ({
    name: anuncio.nombre,
    value: anuncio.nombre,
  }));
}

module.exports = {
  name: "anuncio",
  description: "Gestiona los anuncios del server",
  options: [
    {
      type: 1,
      name: "publicar",
      description: "Publica un anuncio en este canal",
      required: false,
      options: [
        {
          type: 3, // STRING
          name: "nombre",
          description: "Nombre del anuncio a publicar",
          required: true,
          choices: generateChoices(),
        },
      ],
    },
    {
      type: 1,
      name: "eliminar",
      description: "Elimina un anuncio",
      required: false,
      options: [
        {
          type: 3, // STRING
          name: "nombre",
          description: "Nombre del anuncio a eliminar",
          required: true,
          choices: generateChoices(),
        },
      ],
    },
    {
      type: 1,
      name: "crear",
      description: "Crea un anuncio para publicarlo después",
      required: false,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  type: 1,

  callback: async (client, interaction) => {
    try {
      if (
        !interaction.member.permissions.has(PermissionFlagsBits.Administrator)
      ) {
        await interaction.reply(
          "No tienes permisos para usar este comando <:deadmf:1099213086201745459>"
        );
        return;
      }

      const subcommand = interaction.options.getSubcommand();

      switch (subcommand) {
        case "publicar": // Lógica para publicar
          const nombrePublicar = interaction.options.getString("nombre");

          const anuncio = anuncios.find((a) => a.nombre === nombrePublicar);

          if (!anuncio) {
            await interaction.reply(
              "Anuncio no encontrado <:deadmf:1099213086201745459>"
            );
            return;
          }
          await interaction.reply({
            content: `Ok, voy a emitir el anuncio: ${anuncio.nombre}`,
            ephemeral: true,
          });
          // Obtén el canal donde se originó la interacción
          const channel = client.channels.cache.get(interaction.channelId);
          // Envia un mensaje al mismo canal
          await channel.send(anuncio.mensaje);
          break;

        case "eliminar": // Lógica para eliminar
          try {
            const nombreEliminar = interaction.options.getString("nombre");

            // Buscar el índice del anuncio en el array basado en el nombre
            const indexEliminar = anuncios.findIndex(
              (anuncio) => anuncio.nombre === nombreEliminar
            );

            // Verificar si se encontró el anuncio
            if (indexEliminar !== -1) {
              // Eliminar el anuncio del array
              const anuncioEliminado = anuncios.splice(indexEliminar, 1)[0];

              // Guardar los cambios en el archivo JSON
              fs.writeFileSync(
                anunciosFilePath,
                JSON.stringify(anuncios, null, 2)
              );

              await interaction.reply({
                content: `Anuncio "${nombreEliminar}" eliminado correctamente.`,
                ephemeral: true,
              });

              console.log("Anuncio eliminado:", anuncioEliminado);
            } else {
              await interaction.reply({
                content: `No se encontró un anuncio con el nombre "${nombreEliminar}".`,
                ephemeral: true,
              });
            }
          } catch (error) {
            console.error(error);
            await interaction.reply("Hubo un error al procesar el comando.");
          }
          break;

        case "crear": // Lógica para crear
          const modal = new ModalBuilder()
            .setCustomId("modalAnuncio")
            .setTitle("Anuncio");

          const NombreAnuncioInput = new TextInputBuilder()
            .setCustomId("NombreAnuncioInput")
            .setLabel("Nombre con el que se registrará el anuncio")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Competencia furry")
            .setRequired(true);

          const TituloAnuncioInput = new TextInputBuilder()
            .setCustomId("TituloAnuncioInput")
            .setLabel("Título en tamaño grande (opcional)")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Competencia de cosplay furry!")
            .setRequired(false);

          const CuerpoAnuncioInput = new TextInputBuilder()
            .setCustomId("CuerpoAnuncioInput")
            .setLabel("Cuerpo del anuncio")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("Hola furritos! Los invitamos el dia etc etc etc")
            .setRequired(true);

          const ImagenAnuncioInput = new TextInputBuilder()
            .setCustomId("ImagenAnuncioInput")
            .setLabel("Imagen que acompaña al anuncio (opcional)")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("htttps://i.imgur.com/imagenfurry.jpg")
            .setRequired(false);

          const firstActionRow = new ActionRowBuilder().addComponents(
            NombreAnuncioInput
          );
          const secondActionRow = new ActionRowBuilder().addComponents(
            TituloAnuncioInput
          );
          const thirdActionRow = new ActionRowBuilder().addComponents(
            CuerpoAnuncioInput
          );
          const fourthActionRow = new ActionRowBuilder().addComponents(
            ImagenAnuncioInput
          );

          modal.addComponents(
            firstActionRow,
            secondActionRow,
            thirdActionRow,
            fourthActionRow
          );

          await interaction.showModal(modal);
          break;

        default:
          await interaction.reply({
            content: "Opción no reconocida. <:deadmf:1099213086201745459>",
            ephemeral: true,
          });
          return;
      }
    } catch (error) {
      console.error(error);
      // Maneja los errores si es necesario
      await interaction.reply({
        content: "Hubo un error al procesar el comando.",
        ephemeral: true,
      });
    }
  },
};
