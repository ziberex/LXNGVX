const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const User = require('../user.js');
module.exports = (client) => {
    client.on(Events.GuildMemberAdd, async (member) => {
        let m = await User.findOne({ userID: member.id, guild: member.guild.id }) || new User({ userID: member.id, guild: member.guild.id })
        if (member.user.bot) {
            return;
        } else {
            member.roles.add("1154908829318905886")
        }
        m.save();
    })
    client.on("ready", async () => {
        setInterval(async () => {
            const users = await User.find({ ban: true, guild: { $ne: null } });
            users.forEach(async g => {
                let guild = client.guilds.cache.get("1154873343124717649")
                if (!guild) return;
                let now = new Date()
                let time = g.ban_date;
                if (time <= now) {
                    let user = await User.findOne({ userID: g.userID, guild: "1154873343124717649" })
                    user.ban = false;
                    user.ban_date = null
                    await user.save()
                    let member = guild.members.cache.get(g.userID)
                    await member.send({ content: `Hi, your ban was removed for reason: **the ban period has expired**` })
                    member.roles.remove("1157923478876475474")
                    member.roles.add("1154908829318905886")
                }
            })
        }, 600);
        setInterval(async () => {
            const users = await User.find({ ban: true, guild: { $ne: null } });
            users.forEach(async g => {
                let guild = client.guilds.cache.get("1154873343124717649")
                let member = guild.members.cache.get(g.userID)
                member.roles.cache.forEach(r => { if (!r.managed && r.id !== "1154873343124717649" && r.id !== "1157923478876475474") member.roles.remove(r.id) })
                member.roles.add("1157923478876475474")
            })
        }, 600);
    })
}