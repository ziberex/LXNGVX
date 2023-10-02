const { Client, codeBlock, UserSelectMenuBuilder, ComponentType, Collection, state, Options, Events, GatewayIntentBits, ActionRowBuilder, EmbedBuilder, ButtonBuilder, SlashCommandBuilder, ButtonStyle, REST, Routes, AttachmentBuilder, ChannelType, VoiceChannel, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, ContextMenuCommandBuilder, ApplicationCommandType, ThreadChannel, ThreadManager, ThreadAutoArchiveDuration, activities, VoiceRegion, NewsChannel, SelectMenuBuilder, Embed } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const User = require('../user.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-top')
        .setDescription('Top users by voice active/messages'),

    async execute(interaction) {
        let user = interaction.guild.members.cache.get(interaction.user.id)
        let users = await User.find({ guild: interaction.guild.id, msg: { $ne: null } }).sort({ msg: -1 }).limit(10)
        let text = '';
        let userss = await User.findOne({ userID: interaction.user.id, guild: interaction.guild.id }) || new User({ userID: interaction.user.id, guild: interaction.guild.id });
        let n = 0;

        for (const user of users) {

            n++
            let u = interaction.guild.members.cache.get(user.userID);
            if (!u) {
                await User.deleteOne({ userID: user.userID, guild: interaction.guild.id })
                break;
            }
            let a = u.user.username || "empty";
            text += `**#${n}. ${a}**\n> ${user.msg} messages\n\n`;
        };

        let top = await User.findOne({ msg: { $gte: userss.msg } }).countDocuments();
        if (!top) top = "unknown"
        let button = new ButtonBuilder()
            .setLabel("Online top")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("online_top")

        const button2 = new ButtonBuilder()
            .setLabel("Close top")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("close_top")
        const row = new ActionRowBuilder()
            .addComponents(button)
            .addComponents(button2)
        let embed = new EmbedBuilder()
        embed.setTitle(`Top 10 chats active`)
            .setFooter({ text: `Your position - ${top}` })
            .setDescription(text)
            .setColor("#2b2d31")
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        interaction.reply({ embeds: [embed], components: [row] })
    }
}