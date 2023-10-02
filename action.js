const { Client, codeBlock, UserSelectMenuBuilder, ComponentType, Collection, state, Options, Events, GatewayIntentBits, ActionRowBuilder, EmbedBuilder, ButtonBuilder, SlashCommandBuilder, ButtonStyle, REST, Routes, AttachmentBuilder, ChannelType, VoiceChannel, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, ContextMenuCommandBuilder, ApplicationCommandType, ThreadChannel, ThreadManager, ThreadAutoArchiveDuration, activities, VoiceRegion, NewsChannel, SelectMenuBuilder, Embed } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const User = require(`../user.js`)
module.exports = {
    data: new SlashCommandBuilder()
        .setName('action')
        .setDescription('Command for mod actions')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User you want to interact with')
                .setRequired(true)
        ),

    async execute(interaction) {
        let user = interaction.guild.members.cache.get(interaction.user.id)
        let member = interaction.options.getUser("user")
        let target = interaction.guild.members.cache.get(member.id)
        let mem = await User.findOne({ userID: target.id, guild: interaction.guild.id })
        let mute = target.isCommunicationDisabled() ? "True" : "False"
        let ban = mem.ban == true ? "True" : "False"
        if (!user.roles.cache.has("1154906921241948200") && !user.roles.cache.has("1154907310825685112") && !user.roles.cache.has("1155128696701726772") && !user.roles.cache.has("1154904976653561866")) return interaction.reply({ content: "You don't have permissions to use this commands", ephemeral: true })
        let embed = new EmbedBuilder()
            .setColor("#2b2d31")
            .setDescription(`\`\`\`Choose mod action which you need\`\`\``)
            .addFields({
                name: "> Target",
                value: `${target}`
            })
            .addFields({
                name: "> Muted",
                value: `${mute}`
            })
            .addFields({
                name: "> Warns",
                value: `${mem.warns}`
            })
            .addFields({
                name: "> Banned",
                value: `${ban}`
            })
        const button = new ButtonBuilder()
            .setLabel("⠀Mute⠀")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(target.isCommunicationDisabled())
            .setCustomId("mute_user")

        const button3 = new ButtonBuilder()
            .setLabel("⠀Warn⠀")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(mem.warns == 3 || mem.ban == true)
            .setCustomId("warn_user")

        const button5 = new ButtonBuilder()
            .setLabel("⠀Ban⠀")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(mem.ban == true)
            .setCustomId("user_ban")

        const button2 = new ButtonBuilder()
            .setLabel("Unmute")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(!target.isCommunicationDisabled())
            .setCustomId("unmute_user")

        const button4 = new ButtonBuilder()
            .setLabel("Unwarn")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(mem.warns == 0)
            .setCustomId("unwarn_user")

        const button6 = new ButtonBuilder()
            .setLabel("Unban")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(mem.ban !== true)
            .setCustomId("unban_user")
        const row = new ActionRowBuilder()
            .addComponents(button)
            .addComponents(button3)
            .addComponents(button5)
        const row2 = new ActionRowBuilder()
            .addComponents(button2)
            .addComponents(button4)
            .addComponents(button6)

        await interaction.reply({ embeds: [embed], components: [row, row2], ephemeral: true })
    }
}