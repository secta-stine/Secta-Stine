module.exports = async (client, oldState, newState) => {
  try {
    // Obtiene el channelId del antiguo estado y el nuevo estado
    const oldChannelId = oldState?.channelId;
    const newChannelId = newState?.channelId;

    // Verifica si ambos channelIds son nulos o indefinidos
    if (!oldChannelId && !newChannelId) {
      console.log("No hay canal de voz en ambos estados");
      return;
    }

    const voiceChannel = client.channels.cache.get(
      newChannelId || oldChannelId
    );
    const exactlyOneHasChannel =
      (oldChannelId && !newChannelId) || (!oldChannelId && newChannelId);

    // console.log(`valor variable ${exactlyOneHasChannel}`);

    if (!exactlyOneHasChannel) {
    } else {
      const voiceChannel = client.channels.cache.get(
        newChannelId || oldChannelId
      );

      // Verifica que voiceChannel esté definido
      if (!voiceChannel) {
        console.log("Canal de voz no válido");
        return;
      }

      // Filtra usuarios no bot en el canal de voz
      const realUsers = voiceChannel.members.filter(
        (member) => !member.user.bot
      );
      // Verifica si hay exactamente 2 usuarios no bot
      if (realUsers.size === 2) {
        // Obtiene los nombres de los usuarios
        const userNames = realUsers
          .map((member) => member.displayName)
          .join(" y ");

        // Envia el mensaje al canal de texto asociado al canal de voz
        voiceChannel.send(
          `¡${userNames} son mis papis! <:Contershy:1115041509683777547>`
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
};
