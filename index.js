
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  SlashCommandBuilder,
  REST,
  Routes,
  PermissionsBitField,
} = require("discord.js");

require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// ==============================
// SETTINGS
// ==============================

const CHANNEL_NAME = "୨୧・ʀᴜʟᴇs";

// ==============================
// RULES EMBED
// ==============================

function createRulesEmbed() {
  return new EmbedBuilder()
    .setColor("#f49ad1")
    .setTitle("𓆩♡𓆪・deadroses rules")
    .setDescription(
      [
        "୨ৎ **01.** Be respectful to everyone.",
        "୨ৎ **02.** No spam or flooding chats.",
        "୨ৎ **03.** No NSFW or inappropriate content.",
        "୨ৎ **04.** No advertising without permission.",
        "୨ৎ **05.** Use the correct channels.",
        "୨ৎ **06.** No hate, harassment, or drama.",
        "୨ৎ **07.** Respect everyone's privacy.",
        "୨ৎ **08.** Listen to staff.",
        "୨ৎ **09.** No impersonation.",
        "୨ৎ **10.** Have fun and be kind!",
        "",
        "𓆩♡𓆪 Breaking rules may result in moderation."
      ].join("\n")
    )
    .setFooter({ text: "deadroses ♡" });
}

// ==============================
// SLASH COMMAND
// ==============================

const commands = [
  new SlashCommandBuilder()
    .setName("setup-rules")
    .setDescription("Post the deadroses rules.")
    .setDefaultMemberPermissions(
      PermissionsBitField.Flags.Administrator
    ),
].map(command => command.toJSON());

// ==============================
// READY
// ==============================

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const rest = new REST({ version: "10" }).setToken(
    process.env.DISCORD_TOKEN
  );

  try {
    await rest.put(
      Routes.applicationGuildCommands(
        client.user.id,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("Rules command registered!");
  } catch (error) {
    console.error("Command registration failed:", error);
  }
});

// ==============================
// INTERACTIONS
// ==============================

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "setup-rules") return;

  const channel = interaction.guild.channels.cache.find(
    channel => channel.name === CHANNEL_NAME
  );

  if (!channel || !channel.isTextBased()) {
    return interaction.reply({
      content: `Rules channel "${CHANNEL_NAME}" was not found.`,
      ephemeral: true,
    });
  }

  try {
    await channel.send({
      embeds: [createRulesEmbed()],
    });

    await interaction.reply({
      content: "𓆩♡𓆪 Rules posted successfully!",
      ephemeral: true,
    });
  } catch (error) {
    console.error(error);

    await interaction.reply({
      content: "I couldn't post the rules. Check my channel permissions.",
      ephemeral: true,
    });
  }
});

// ==============================
// LOGIN
// ==============================

client.login(process.env.DISCORD_TOKEN);
