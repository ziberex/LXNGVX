const {
    ChannelType,
    PermissionsBitField,
} = require("discord.js");
const User = require(`../user.js`)
const voiceMem = new Map();
module.exports = (client) => {
    client.on("voiceStateUpdate", async (oldState, newState) => {
        if (!newState.channel && voiceMem.get(oldState.id)) {
            let now = new Date()
            const guild = client.guilds.cache.get("1154873343124717649")
            let member = guild.members.cache.get(oldState.member.id);
            if (!member) return;
            if (member.voice.serverDeaf) return;
            if (member.voice.selfDeaf) return;
            let time = Date.now() - voiceMem.get(oldState.member.id).timestamp;
            let user1 = await User.findOne({ userID: member.id, guild: member.guild.id })
            user1.voice = user1.voice || 0;
            voiceMem.delete(oldState.member.id);
            user1.voice = user1.voice + time;
            user1.save().catch(() => { });
        }
        if (newState.channel && !voiceMem.get(newState.member.id)) {
            voiceMem.set(newState.member.id, { timestamp: Date.now() });
        }
    })

    client.on("voiceStateUpdate", async (oldState, newState) => {
        const guild = client.guilds.cache.get("1154873343124717649");
        let channel = client.channels.cache.get("1155490250404135022");
        if (newState.channelId === channel.id) {
            let mem = newState.guild.members.cache.get(newState.id);
            await newState.guild.channels
                .create({
                    name: newState.member.displayName,
                    type: ChannelType.GuildVoice,
                    parent: "1155489858479988867",
                    permissionOverwrites: [
                        {
                            id: newState.guild.id,
                            allow: [
                                PermissionsBitField.Flags.ViewChannel,
                                PermissionsBitField.Flags.Connect,
                                PermissionsBitField.Flags.Speak,
                                PermissionsBitField.Flags.Stream,
                            ],
                        },
                        {
                            id: newState.member.id,
                            allow: [
                                PermissionsBitField.Flags.ViewChannel,
                                PermissionsBitField.Flags.Connect,
                                PermissionsBitField.Flags.Speak,
                                PermissionsBitField.Flags.MuteMembers,
                                PermissionsBitField.Flags.ManageChannels,
                                PermissionsBitField.Flags.Stream,
                            ],
                        },
                        ...newState.channel.parent.permissionOverwrites.cache.values(),
                    ],
                })
                .then((ch) => {
                    if (newState.channelId) newState.setChannel(ch);
                });
        }

        if (oldState) {
            if (!newState) {
                let eb = guild.channels.cache.find(
                    (x) => x.name == oldState.member.displayName
                );
                if (eb) {
                    if (
                        eb.type == ChannelType.GuildVoice &&
                        eb.parentId === "1155489858479988867"
                    ) {
                        if (eb.members.size == 0) eb.delete().catch(() => { });
                    }
                }
            }
        }
        if (
            oldState.channelId !== "1155490250404135022" &&
            oldState.channel &&
            oldState.channel.members.size == 0 &&
            oldState.channel.parentId === "1155489858479988867"
        ) {
            oldState.channel.delete().catch(() => { });
        }
    });
};