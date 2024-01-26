const fs = require("fs");
const path = require("path");

module.exports = async (client, interaction) => {
  if (!interaction.isModalSubmit()) return;

  if (interaction.customId === "modalConfesion") {
    try {
      await interaction.reply({
        content: "Cómo me gusta el chisme <a:clasic:1152464028682158141>",
        ephemeral: true,
      });

      const confesion = interaction.fields.getTextInputValue("confesionInput");
      mensajeConfesion = {
        content: "",
        tts: false,
        embeds: [
          {
            id: 599702415,
            description: confesion,
            fields: [],
            title: "¡Confesión recibida! <:waos:1121012005072015361>",
            footer: {
              text: "Banca el shat? ",
            },
          },
        ],
        components: [],
        actions: {},
        username: "Secta Stine",
      };

      const channel = client.channels.cache.get("1175214768609579148");
      await channel.send(mensajeConfesion);
    } catch (error) {
      console.error(error);
    }
  }

  if (interaction.customId === "modalAnuncio") {
    try {
      const anunciosFilePath = path.join(__dirname, "../../data/anuncios.json");

      const nombreAnuncio =
        interaction.fields.getTextInputValue("NombreAnuncioInput");
      const tituloAnuncio =
        interaction.fields.getTextInputValue("TituloAnuncioInput");
      const cuerpoAnuncio =
        interaction.fields.getTextInputValue("CuerpoAnuncioInput");
      const ImagenAnuncio =
        interaction.fields.getTextInputValue("ImagenAnuncioInput");

      const anunciosData = fs.readFileSync(anunciosFilePath, "utf8");
      const anuncios = JSON.parse(anunciosData);

      const anuncioExistente = anuncios.find(
        (anuncio) => anuncio.nombre === nombreAnuncio
      );

      if (anuncioExistente) {
        await interaction.reply({
          content:
            "Ya existe un anuncio con el mismo título. Por favor, elige un título diferente.",
          ephemeral: true,
        });
        return;
      }

      var contenidoAnuncio = cuerpoAnuncio;
      if (tituloAnuncio !== null && tituloAnuncio !== undefined) {
        contenidoAnuncio = "# " + tituloAnuncio + "\n\n" + cuerpoAnuncio;
      }

      const nuevoAnuncio = {
        nombre: nombreAnuncio,
        mensaje: {
          content: cuerpoAnuncio,
          tts: false,
          embeds: [],
          files: ImagenAnuncio
            ? [
                {
                  attachment: ImagenAnuncio,
                  name: "Anuncio.png",
                },
              ]
            : [],
          components: [],
          actions: {},
          username: "Secta Stine",
        },
      };

      // Agrega el nuevo anuncio al arreglo existente
      anuncios.push(nuevoAnuncio);

      // Escribe el arreglo actualizado al archivo JSON
      fs.writeFileSync(anunciosFilePath, JSON.stringify(anuncios, null, 2));
      await interaction.reply({
        content: "Anuncio registrado <:ConterNice:1122616228389847050>",
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
    }
  }
};
