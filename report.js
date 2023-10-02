const {
    Client,
    codeBlock,
    UserSelectMenuBuilder,
    ComponentType,
    Collection,
    state,
    Options,
    Events,
    GatewayIntentBits,
    ActionRowBuilder,
    EmbedBuilder,
    ButtonBuilder,
    SlashCommandBuilder,
    ButtonStyle,
    REST,
    Routes,
    AttachmentBuilder,
    ChannelType,
    VoiceChannel,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    StringSelectMenuBuilder,
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    ThreadChannel,
    ThreadManager,
    ThreadAutoArchiveDuration,
    activities,
    VoiceRegion,
    NewsChannel,
    SelectMenuBuilder,
} = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
module.exports = {
    data: new SlashCommandBuilder()
        .setName("report")
        .setDescription("Contact mods")
        .addUserOption((option) =>
            option.setName("user").setDescription("target").setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("reason").setDescription("reason").setRequired(true)
        ),

    async execute(interaction) {
        let member = interaction.options.getUser("user");
        let target = interaction.guild.members.cache.get(member.id);
        console.log(target);
        let us = interaction.guild.members.cache.get(interaction.user.id);
        if (!target) {
            return interaction.reply({
                content: "Mention a real person!",
                ephemeral: true,
            });
        }
        if (member.id == us.id)
            return interaction.reply({
                content: "You cannot report yourself",
                ephemeral: true,
            });
        await interaction.reply({
            content: "Successfully! Now wait for mods answer.",
            ephemeral: true,
        });
        let ch = interaction.guild.channels.cache.get("1155084421603532850");
        let reason = interaction.options.getString("reason");
        const button = new ButtonBuilder()
            .setLabel("Take report")
            .setStyle(ButtonStyle.Success)
            .setCustomId("report_accept");
        const button2 = new ButtonBuilder()
            .setLabel("Deny report")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("report_deny");
        const row = new ActionRowBuilder()
            .addComponents(button)
            .addComponents(button2);
        const avatarURL = us.user.avatar
            ? us.user.avatarURL({ dynamic: true })
            : "https://cdn.discordapp.com/attachments/973249401185243166/1130820871309762560/BRUHMM.gif";
        let emb = new EmbedBuilder()
            .setTitle(`New report`)
            .setColor("#2b2d31")
            .addFields({
                name: `> User:`,
                value: `<@${interaction.user.id}>`,
            })
            .addFields({
                name: `> Target:`,
                value: `<@${target.id}>`,
            })
            .addFields({
                name: `> Reason:`,
                value: `${reason}`,
            })
            .addFields({
                name: `> Highest target role:`,
                value: `<@&${target.roles.highest.id}>`,
            })
            .setThumbnail(avatarURL);
        await ch.send({ embeds: [emb], components: [row] });
    },
};