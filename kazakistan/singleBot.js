// singleBot.js
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { joinVoiceChannel, entersState, VoiceConnectionStatus } = require('@discordjs/voice');

const wait = (ms) => new Promise(r => setTimeout(r, ms));

module.exports = async function(config, botNumber) {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildVoiceStates
    ]
  });

  client.once('ready', async () => {
    console.log(`[Bot ${botNumber}] ${client.user.tag} is ready`);

    client.user.setPresence({
      activities: [{ name: config.statusText, type: ActivityType.Streaming, url: config.streamingURL }],
      status: 'online'
    });

    try {
      const guild = await client.guilds.fetch(config.guildId);
      const channel = await guild.channels.fetch(config.voiceChannelId);

      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
      });

      await entersState(connection, VoiceConnectionStatus.Ready, 10000);
      console.log(`[Bot ${botNumber}] Joined voice channel successfully`);

    } catch (err) {
      console.error(`[Bot ${botNumber}] Error joining voice:`, err.message);
    }
  });

  client.on('error', console.error);
  await client.login(config.token);
};
