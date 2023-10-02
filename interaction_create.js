const { UserSelectMenuBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField } = require('discord.js');
const User = require('../user.js');
const ms = require('ms');
module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (interaction.customId == "report_accept") {
            let m = interaction.message.embeds[0].fields[1].value;
            let member = m.replace(/[^0-9]/g, "");
            let target = interaction.guild.members.cache.get(member);
            let us = interaction.message.embeds[0].fields[0].value;
            let user = us.replace(/[^0-9]/g, "");
            let sender = interaction.guild.members.cache.get(user);
            let reason = interaction.message.embeds[0].fields[2].value;
            console.log(reason);
            let emb = new EmbedBuilder(interaction.message.embeds[0]);
            emb.setColor("#b1f1be");
            interaction.update({
                content: `Report has taken by <@${interaction.user.id}>`,
                components: [],
                embeds: [emb],
            });
            const ch = await interaction.guild.channels.create({
                name: "report",
                type: ChannelType.GuildText,
                parent: interaction.guild.channels.cache.get("1155200375599681746"),
                permissionOverwrites: [
                    {
                        id: member,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages,
                        ],
                    },
                    {
                        id: interaction.user.id,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ManageMessages,
                        ],
                    },
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                ],
            });
            let button = new ButtonBuilder()
                .setLabel("Close report")
                .setStyle(ButtonStyle.Danger)
                .setCustomId("close_report");
            let button2 = new ButtonBuilder()
                .setLabel("Add person")
                .setStyle(ButtonStyle.Success)
                .setCustomId("add_to_report");
            const row = new ActionRowBuilder()
                .addComponents(button)
                .addComponents(button2);
            let embed = new EmbedBuilder()
                .setTitle(`${sender.user.username}'s report`)
                .setColor("#2b2d31")
                .addFields({
                    name: `> Report sender:`,
                    value: `<@${sender.id}>`,
                })
                .addFields({
                    name: `> Target:`,
                    value: `<@${target.id}>`,
                })
                .addFields({
                    name: `> Report reason:`,
                    value: `${reason}`,
                })
                .setDescription(
                    `> Report will be considered by <@${interaction.user.id}>`
                );
            ch.send({ components: [row], embeds: [embed] });
        }
        if (interaction.customId == "report_deny") {
            const modal = new ModalBuilder()
                .setCustomId("report_modal")
                .setTitle("Reason");
            const b1 = new TextInputBuilder()
                .setCustomId("reason_report")
                .setLabel("Type reason here")
                .setStyle(TextInputStyle.Short);
            const row = new ActionRowBuilder().addComponents(b1);
            modal.addComponents(row);

            await interaction.showModal(modal);
        }
        if (interaction.isModalSubmit() && interaction.customId == "report_modal") {
            let emb = new EmbedBuilder(interaction.message.embeds[0]);
            let reason = interaction.fields.getTextInputValue("reason_report");
            let now = new Date();
            const timestamp = Math.round(now.getTime() / 1000);
            emb.setFields({
                name: `> Reason:`,
                value: `${reason}`,
            });
            emb.addFields({
                name: `> Denied:`,
                value: `<t:${timestamp}:R>`,
            });
            emb.setColor("#ff0000");
            emb.setTitle("Report deny");
            interaction.update({
                content: `Report has denied by <@${interaction.user.id}>`,
                components: [],
                embeds: [emb],
            });
        }
        if (interaction.customId == "close_report") {
            let member = interaction.message.embeds[0].description.replace(/[^0-9]/g, "");
            if (interaction.user.id !== member) return interaction.reply({ content: `You don't have permissions to close this report!`, ephemeral: true })
            const channel = interaction.guild.channels.cache.get(interaction.channelId);
            await channel.delete();
        }
        if (interaction.customId == "add_to_report") {
            let member = interaction.message.embeds[0].description.replace(/[^0-9]/g, "");
            if (interaction.user.id !== member) return interaction.reply({ content: `You don't have permissions to manage this report!`, ephemeral: true })
            let select = new UserSelectMenuBuilder()
                .setCustomId("report_new_select")
                .setPlaceholder("Choose person")
                .setMaxValues(1);
            const row = new ActionRowBuilder().addComponents(select);
            let emb = new EmbedBuilder()
                .setColor("2bda0f")
                .setDescription(
                    `**<@${interaction.user.id}>, choose the user you want to add to report channel!**`
                )
                .setTimestamp();
            interaction.reply({ embeds: [emb], components: [row], ephemeral: true });
        }
        if (
            interaction.isUserSelectMenu() &&
            interaction.customId == "report_new_select"
        ) {
            let value = interaction.values[0];
            let user = interaction.guild.members.cache.get(value);
            const ch = interaction.guild.channels.cache.get(interaction.channelId);
            if (
                !ch.permissionOverwrites.cache.get(user.id) ||
                !ch.permissionsFor(user.id) ||
                !ch.permissionsFor(user).has(PermissionsBitField.Flags.ViewChannel)
            ) {
                ch.permissionOverwrites.edit(user, {
                    [PermissionsBitField.Flags.ViewChannel]: true,
                    [PermissionsBitField.Flags.SendMessages]: true,
                });
                await interaction.reply({
                    content: `<@${user.id}> now can view and send messages in report channel!`,
                    ephemeral: true,
                });
            } else {
                return interaction.reply({
                    content: `<@${user.id}> already has permissions to view and send messages!`,
                    ephemeral: true,
                });
            }
        }
    });
    client.on("interactionCreate", async (interaction) => {
        if (interaction.isButton() && interaction.customId == "privat_2") {
            let us = interaction.guild.members.cache.get(interaction.user.id);
            if (us.user.bot) return;
            if (!us.voice.channelId) {
                let a = new EmbedBuilder()
                    .setColor("#d30d27")
                    .setDescription(`**<@${us.id}>, you need to join voice channel!**`);
                interaction.reply({ embeds: [a], ephemeral: true });
                return;
            }
            let ch_1 = us.voice.channel;
            if (ch_1.parentId !== "1155489858479988867")
                return interaction.reply({
                    content: "You're in incorrect category!",
                    ephemeral: true,
                });
            if (
                !ch_1.permissionOverwrites.cache.get(interaction.user.id) ||
                !ch_1.permissionsFor(interaction.user.id) ||
                !ch_1
                    .permissionsFor(interaction.user.id)
                    .has(PermissionsBitField.Flags.ManageChannels)
            )
                return interaction.reply({
                    content: "This is not your channel!",
                    ephemeral: true,
                });
            const modal = new ModalBuilder()
                .setCustomId("choose_limit")
                .setTitle("Limit changer");
            const b1 = new TextInputBuilder()
                .setCustomId("b1")
                .setLabel("Type here new limit")
                .setStyle(TextInputStyle.Short);
            const row = new ActionRowBuilder().addComponents(b1);
            modal.addComponents(row);

            await interaction.showModal(modal);
        }
        if (interaction.isModalSubmit() && interaction.customId == "choose_limit") {
            const p1 = interaction.fields.getTextInputValue("b1");
            let us = interaction.guild.members.cache.get(interaction.user.id);
            if (us.user.bot) return;
            if (!us.voice.channelId) {
                let a = new EmbedBuilder()
                    .setColor("#d30d27")
                    .setDescription(`**<@${us.id}>, you need to join voice channel!**`);
                interaction.reply({ embeds: [a], ephemeral: true });
                return;
            }
            let ch_1 = us.voice.channel;
            if (ch_1.parentId !== "1155489858479988867")
                return interaction.reply({
                    content: "You're in incorrect category!",
                    ephemeral: true,
                });
            if (
                !ch_1.permissionOverwrites.cache.get(interaction.user.id) ||
                !ch_1.permissionsFor(interaction.user.id) ||
                !ch_1
                    .permissionsFor(interaction.user.id)
                    .has(PermissionsBitField.Flags.ManageChannels)
            )
                return interaction.reply({
                    content: "This is not your channel!",
                    ephemeral: true,
                });

            if (isNaN(p1) == true)
                return interaction.reply({
                    content: "!",
                    ephemeral: true,
                });
            let sum = Number(p1);
            if (sum < 0 || sum > 99)
                return interaction.reply({
                    content: "Choose limit between 1 and 99!",
                    ephemeral: true,
                });

            ch_1.setUserLimit(sum);
            let embs = new EmbedBuilder()
                .setColor("2bda0f")
                .setDescription(`**✅ Successfully!**`)
                .setTimestamp();
            interaction.reply({ embeds: [embs], ephemeral: true });
        }
        if (interaction.isButton() && interaction.customId == "privat_4") {
            let us = interaction.guild.members.cache.get(interaction.user.id);
            if (us.user.bot) return;
            if (!us.voice.channelId) {
                let a = new EmbedBuilder()
                    .setColor("#d30d27")
                    .setDescription(`**<@${us.id}>, you need to join voice channel!**`);
                interaction.reply({ embeds: [a], ephemeral: true });
                return;
            }
            let ch_1 = us.voice.channel;
            if (ch_1.parentId !== "1155489858479988867")
                return interaction.reply({
                    content: "You're in incorrect category!",
                    ephemeral: true,
                });
            if (
                !ch_1.permissionOverwrites.cache.get(interaction.user.id) ||
                !ch_1.permissionsFor(interaction.user.id) ||
                !ch_1
                    .permissionsFor(interaction.user.id)
                    .has(PermissionsBitField.Flags.ManageChannels)
            )
                return interaction.reply({
                    content: "This is not your channel!",
                    ephemeral: true,
                });
            const r = new UserSelectMenuBuilder()
                .setCustomId("disconnect_select")
                .setPlaceholder("Select user")
                .setMaxValues(1);
            const row = new ActionRowBuilder().addComponents(r);
            let emb = new EmbedBuilder()
                .setColor("2bda0f")
                .setDescription(`**<@${us.id}>, choose the user you want to ban/unban in your voice! **`)
                .setTimestamp();
            interaction.reply({ embeds: [emb], components: [row], ephemeral: true });
        }
        if (
            interaction.isUserSelectMenu() &&
            interaction.customId == "disconnect_select"
        ) {
            let us = interaction.guild.members.cache.get(interaction.user.id);
            if (us.user.bot) return;
            if (!us.voice.channelId) {
                let a = new EmbedBuilder()
                    .setColor("#d30d27")
                    .setDescription(`**<@${us.id}>, you need to join voice channel!**`);
                interaction.reply({ embeds: [a], ephemeral: true });
                return;
            }
            let ch_1 = us.voice.channel;
            if (ch_1.parentId !== "1155489858479988867")
                return interaction.reply({
                    content: "You're in incorrect category!",
                    ephemeral: true,
                });
            if (
                !ch_1.permissionOverwrites.cache.get(interaction.user.id) ||
                !ch_1.permissionsFor(interaction.user.id) ||
                !ch_1
                    .permissionsFor(interaction.user.id)
                    .has(PermissionsBitField.Flags.ManageChannels)
            )
                return interaction.reply({
                    content: "This is not your channel!",
                    ephemeral: true,
                });
            const sel = interaction.values[0];
            const guild = client.guilds.cache.get("1154873343124717649");
            mem = guild.members.cache.get(sel);
            if (
                ch_1.permissionsFor(mem.id).has([PermissionsBitField.Flags.Connect])
            ) {
                ch_1.permissionOverwrites.edit(mem, {
                    [PermissionsBitField.Flags.Connect]: false,
                });
                mem.voice.disconnect();
            }
            if (
                !ch_1.permissionsFor(mem.id).has([PermissionsBitField.Flags.Connect])
            ) {
                ch_1.permissionOverwrites.edit(mem, {
                    [PermissionsBitField.Flags.Connect]: true,
                });
            }
            let embs = new EmbedBuilder()
                .setColor("2bda0f")
                .setDescription(`**✅ Successfully!**`)
                .setTimestamp();
            interaction.reply({ embeds: [embs], ephemeral: true });
        }
        if (interaction.isButton() && interaction.customId == "privat_1") {
            let us = interaction.guild.members.cache.get(interaction.user.id);
            if (us.user.bot) return;
            if (!us.voice.channelId) {
                let a = new EmbedBuilder()
                    .setColor("#d30d27")
                    .setDescription(`**<@${us.id}>, you need to join voice channel!**`);
                interaction.reply({ embeds: [a], ephemeral: true });
                return;
            }
            let ch_1 = us.voice.channel;
            if (ch_1.parentId !== "1155489858479988867")
                return interaction.reply({
                    content: "You're in incorrect category!",
                    ephemeral: true,
                });
            if (
                !ch_1.permissionOverwrites.cache.get(interaction.user.id) ||
                !ch_1.permissionsFor(interaction.user.id) ||
                !ch_1
                    .permissionsFor(interaction.user.id)
                    .has(PermissionsBitField.Flags.ManageChannels)
            )
                return interaction.reply({
                    content: "This is not your channel",
                    ephemeral: true,
                });
            const modal = new ModalBuilder()
                .setCustomId("choose_name")
                .setTitle("Voice name changer");
            const b1 = new TextInputBuilder()
                .setCustomId("b10")
                .setLabel("Type here new voice name")
                .setStyle(TextInputStyle.Short);
            const row = new ActionRowBuilder().addComponents(b1);
            modal.addComponents(row);

            await interaction.showModal(modal);
        }
        if (interaction.isModalSubmit() && interaction.customId == "choose_name") {
            let p11 = interaction.fields.getTextInputValue("b10");
            let member = interaction.guild.members.cache.get(interaction.user.id);
            let ch = member.voice.channel;
            if (p11.length > 32)
                return interaction.reply({
                    content: "Name length must be less than 32!",
                    ephemeral: true,
                });
            ch.setName(p11);
            let embs = new EmbedBuilder()
                .setColor("2bda0f")
                .setDescription(`**✅ Successfully!**`)
                .setTimestamp();
            interaction.reply({ embeds: [embs], ephemeral: true });
        }
        if (interaction.isButton() && interaction.customId == "privat_3") {
            let member = interaction.guild.members.cache.get(interaction.user.id);
            if (member.user.bot) return;
            if (!member.voice.channelId) {
                let a = new EmbedBuilder()
                    .setColor("#d30d27")
                    .setDescription(`**<@${member.id}>, you need to join voice channel!**`);
                interaction.reply({ embeds: [a], ephemeral: true });
                return;
            }
            let ch = member.voice.channel;
            if (ch.parentId !== "1155489858479988867")
                return interaction.reply({
                    content: "You're in incorrect category!",
                    ephemeral: true,
                });

            const r = new UserSelectMenuBuilder()
                .setCustomId("owner_select")
                .setPlaceholder("Choose user")
                .setMaxValues(1);
            const row = new ActionRowBuilder().addComponents(r);
            let emb = new EmbedBuilder()
                .setColor("2bda0f")
                .setDescription(
                    `**<@${member.id}>, choose the user you want to transfer voice owner! **`
                )
                .setTimestamp();
            interaction.reply({ embeds: [emb], components: [row], ephemeral: true });
        }
        if (interaction.customId == "owner_select") {
            let member = interaction.guild.members.cache.get(interaction.user.id);
            const ow = interaction.values[0];
            const guild = client.guilds.cache.get("1154873343124717649");
            let mem = guild.members.cache.get(ow);
            if (!mem.voice.channel)
                return interaction.reply({
                    content: `<@${member.id}> user isn't in voice channel!`,
                    ephemeral: true,
                });
            let cz = mem.voice.channel;
            if (cz.parentId !== "1155489858479988867")
                return interaction.reply({
                    content: "user in incorrect category!",
                    ephemeral: true,
                });
            if (mem.voice.channelId !== member.voice.channelId)
                return interaction.reply({
                    content: "user isn't in you channel!",
                    ephemeral: true,
                });
            let ch = member.voice.channel;
            ch.permissionOverwrites.edit(mem, {
                [PermissionsBitField.Flags.ManageChannels]: true,
                [PermissionsBitField.Flags.MoveMembers]: true,
            });
            ch.permissionOverwrites.edit(member, {
                [PermissionsBitField.Flags.ManageChannels]: null,
                [PermissionsBitField.Flags.MoveMembers]: null,
            });
            let embs = new EmbedBuilder()
                .setColor("2bda0f")
                .setDescription(`**✅ Successfully!**`)
                .setTimestamp();
            interaction.reply({ embeds: [embs], ephemeral: true });
        }
        if (interaction.customId == "privat_6") {
            let member = interaction.guild.members.cache.get(interaction.user.id);
            if (member.user.bot) return;
            if (!member.voice.channelId) {
                let a = new EmbedBuilder()
                    .setColor("#d30d27")
                    .setDescription(`**<@${member.id}>, you need to join voice channel!**`);
                interaction.reply({ embeds: [a], ephemeral: true });
                return;
            }
            let ch = member.voice.channel;
            if (ch.parentId !== "1155489858479988867")
                return interaction.reply({
                    content: "You're in incorrect category!",
                    ephemeral: true,
                });
            if (
                !ch.permissionOverwrites.cache.get(interaction.user.id) ||
                !ch.permissionsFor(interaction.user.id) ||
                !ch
                    .permissionsFor(interaction.user.id)
                    .has(PermissionsBitField.Flags.ManageChannels)
            )
                return interaction.reply({
                    content: "This is not your channel!",
                    ephemeral: true,
                });
            const role = member.guild.roles.cache.find(
                (role) => role.name === "@everyone"
            );
            if (
                ch.permissionsFor(role.id).has([PermissionsBitField.Flags.ViewChannel])
            ) {
                ch.permissionOverwrites.edit(role, {
                    [PermissionsBitField.Flags.ViewChannel]: false,
                });
                let embs = new EmbedBuilder()
                    .setColor("2bda0f")
                    .setDescription(`**✅ Your channel now locked!**`)
                    .setTimestamp();
                interaction.reply({ embeds: [embs], ephemeral: true });
            }
            if (
                !ch.permissionsFor(role.id).has([PermissionsBitField.Flags.ViewChannel])
            ) {
                ch.permissionOverwrites.edit(role, {
                    [PermissionsBitField.Flags.ViewChannel]: true,
                });
                let embs = new EmbedBuilder()
                    .setColor("2bda0f")
                    .setDescription(`**✅ Your channel now unlocked!**`)
                    .setTimestamp();
                interaction.reply({ embeds: [embs], ephemeral: true });
            }
        }
        if (interaction.customId == "privat_5") {
            let member = interaction.guild.members.cache.get(interaction.user.id);
            if (member.user.bot) return;
            if (!member.voice.channelId) {
                let a = new EmbedBuilder()
                    .setColor("#d30d27")
                    .setDescription(`**<@${member.id}>, you need to join voice channel!**`);
                interaction.reply({ embeds: [a], ephemeral: true });
                return;
            }
            let ch = member.voice.channel;
            if (ch.parentId !== "1155489858479988867")
                return interaction.reply({
                    content: "You're in incorrect category!",
                    ephemeral: true,
                });
            if (
                !ch.permissionOverwrites.cache.get(interaction.user.id) ||
                !ch.permissionsFor(interaction.user.id) ||
                !ch
                    .permissionsFor(interaction.user.id)
                    .has(PermissionsBitField.Flags.ManageChannels)
            )
                return interaction.reply({
                    content: "This is not your channel!",
                    ephemeral: true,
                });
            const r = new UserSelectMenuBuilder()
                .setCustomId("mute/unmute_select")
                .setPlaceholder("Choose user")
                .setMaxValues(1);
            const row = new ActionRowBuilder().addComponents(r);
            let emb = new EmbedBuilder()
                .setColor("2bda0f")
                .setDescription(
                    `**<@${member.id}>, choose user you want to mute/unmute in your voice! **`
                )
                .setTimestamp();
            interaction.reply({ embeds: [emb], components: [row], ephemeral: true });
        }
        if (interaction.customId == "mute/unmute_select") {
            let member = interaction.guild.members.cache.get(interaction.user.id);
            const ow = interaction.values[0];
            const guild = client.guilds.cache.get("1154873343124717649");
            let mem = guild.members.cache.get(ow);
            if (!mem.voice.channel)
                return interaction.reply({
                    content: `<@${member.id}> user isn't in voice channel!`,
                    ephemeral: true,
                });
            let cz = mem.voice.channel;
            if (cz.parentId !== "1136816970478661734")
                return interaction.reply({
                    content: "user in incorrect category!",
                    ephemeral: true,
                });
            if (mem.voice.channelId !== member.voice.channelId)
                return interaction.reply({
                    content: "user isn't in your channel!",
                    ephemeral: true,
                });
            if (mem.permissions.has([PermissionsBitField.Flags.Speak])) {
                cz.permissionOverwrites.edit(mem, {
                    [PermissionsBitField.Flags.Speak]: false,
                });
                mem.voice.disconnect();
            }
            if (!mem.permissions.has([PermissionsBitField.Flags.Speak])) {
                cz.permissionOverwrites.edit(mem, {
                    [PermissionsBitField.Flags.Speak]: true,
                });
            }
            let embs = new EmbedBuilder()
                .setColor("2bda0f")
                .setDescription(`**✅ Successfully!**`)
                .setTimestamp();
            await interaction.reply({ embeds: [embs], ephemeral: true });
        }
        if (interaction.customId == "privat_7") {
            let member = interaction.guild.members.cache.get(interaction.user.id);
            if (member.user.bot) return;
            if (!member.voice.channelId) {
                let a = new EmbedBuilder()
                    .setColor("#d30d27")
                    .setDescription(`**<@${member.id}>, you need to join voice channel!**`);
                interaction.reply({ embeds: [a], ephemeral: true });
                return;
            }
            let ch = member.voice.channel;
            if (ch.parentId !== "1155489858479988867")
                return interaction.reply({
                    content: "You're in incorrect category!",
                    ephemeral: true,
                });
            if (
                !ch.permissionOverwrites.cache.get(interaction.user.id) ||
                !ch.permissionsFor(interaction.user.id) ||
                !ch
                    .permissionsFor(interaction.user.id)
                    .has(PermissionsBitField.Flags.ManageChannels)
            )
                return interaction.reply({
                    content: "This is not your channel!",
                    ephemeral: true,
                });
            let limit = ch.userLimit
            limit++
            ch.setUserLimit(limit)
            await interaction.reply({ content: `**✅ Successfully!** Now your voice's limit: ${limit}`, ephemeral: true })
        }
        if (interaction.customId == "privat_8") {
            let member = interaction.guild.members.cache.get(interaction.user.id);
            if (member.user.bot) return;
            if (!member.voice.channelId) {
                let a = new EmbedBuilder()
                    .setColor("#d30d27")
                    .setDescription(`**<@${member.id}>, you need to join voice channel!**`);
                interaction.reply({ embeds: [a], ephemeral: true });
                return;
            }
            let ch = member.voice.channel;
            if (ch.parentId !== "1155489858479988867")
                return interaction.reply({
                    content: "You're in incorrect category!",
                    ephemeral: true,
                });
            if (
                !ch.permissionOverwrites.cache.get(interaction.user.id) ||
                !ch.permissionsFor(interaction.user.id) ||
                !ch
                    .permissionsFor(interaction.user.id)
                    .has(PermissionsBitField.Flags.ManageChannels)
            )
                return interaction.reply({
                    content: "This is not your channel!",
                    ephemeral: true,
                });
            let limit = ch.userLimit
            limit--
            ch.setUserLimit(limit)
            await interaction.reply({ content: `**✅ Successfully!** Now your voice's limit: ${limit}`, ephemeral: true })
        }
        if (interaction.customId == "mute_user") {
            const modal = new ModalBuilder()
                .setCustomId("mute_modal")
                .setTitle("Mute info");
            const b1 = new TextInputBuilder()
                .setCustomId("reason_mute")
                .setLabel("Type reason")
                .setStyle(TextInputStyle.Short);
            const b2 = new TextInputBuilder()
                .setCustomId("duration_mute")
                .setLabel("Type mute duration")
                .setStyle(TextInputStyle.Short);
            const row = new ActionRowBuilder()
                .addComponents(b2)
            const row2 = new ActionRowBuilder()
                .addComponents(b1);
            modal.addComponents(row);
            modal.addComponents(row2);

            await interaction.showModal(modal);
        }
        if (interaction.isModalSubmit() && interaction.customId == "mute_modal") {
            let target = interaction.message.embeds[0].fields[0].value
            let member = target.replace(/[^0-9]/g, "");
            const mute_user = interaction.guild.members.cache.get(member)
            let time = interaction.fields.getTextInputValue("duration_mute");
            let reason = interaction.fields.getTextInputValue("reason_mute");
            if (ms(time) < 10000 && time != "2000m") return interaction.reply({ content: "**Укажи время больше 10 секунд**", ephemeral: true })
            if (ms(time) > 7200000 && time != "2000m") return interaction.reply({ content: "**Укажи время ≤ 120 минут!**", ephemeral: true })
            let toms = ms(time);
            let result = Math.floor(toms / 1000);
            if (!result && time != "2000m") return interaction.reply({ content: "**Укажи корректное время!**", ephemeral: true })
            await mute_user.timeout(toms);
            let embed = new EmbedBuilder()
                .setDescription(`<@${member}> was muted for reason \`${reason}\`\n> Moderator: <@${interaction.user.id}>`)
                .setColor("#2b2d31")
            await interaction.reply({ embeds: [embed], ephemeral: true })
            setTimeout(() => {
                interaction.deleteReply();
            }, 6000);
            let ch = interaction.guild.channels.cache.get("1155086878383550524")
            let emb = new EmbedBuilder()
                .setDescription(`<@${member}> was muted for reason \`${reason}\``)
                .addFields({
                    name: "> Duration",
                    value: `${time}`
                })
                .addFields({
                    name: "> Moderator",
                    value: `<@${interaction.user.id}>`
                })
                .setColor("#2b2d31")
            await ch.send({ embeds: [emb] })
        }

        if (interaction.customId == "choose_bitrate") {
            if (interaction.isStringSelectMenu()) {
                const p = interaction.values[0];
                if (p == "24kb" || p == "64kb" || p == "128kb" || p == "256kb" || p == "384kb") {
                    let us = interaction.guild.members.cache.get(interaction.user.id);
                    if (us.user.bot) return;
                    let ch = us.voice.channel;
                    if (!us.voice.channelId) {
                        let a = new EmbedBuilder()
                            .setColor("#d30d27")
                            .setDescription(`**<@${us.id}>, you need to join voice channel!**`)
                        return interaction.reply({ embeds: [a], ephemeral: true })
                    }
                    if (
                        !ch.permissionOverwrites.cache.get(interaction.user.id) ||
                        !ch.permissionsFor(interaction.user.id) ||
                        !ch
                            .permissionsFor(interaction.user.id)
                            .has(PermissionsBitField.Flags.ManageChannels)
                    )
                        return interaction.reply({
                            content: "This is not your channel!",
                            ephemeral: true,
                        });
                    if (p === '24kb') {
                        let member = interaction.guild.members.cache.get(interaction.user.id);
                        if (member.user.bot) return;
                        let ch = member.voice.channel;
                        if (ch.parentId !== "1155489858479988867") return interaction.reply({ content: "You're in incorrect category!" })
                        ch.setBitrate(24000)
                        await interaction.reply({ content: "Your channel's bitrate was setted on **24kbps**", ephemeral: true })
                    }
                    if (p === '64kb') {
                        let member = interaction.guild.members.cache.get(interaction.user.id);
                        if (member.user.bot) return;
                        let ch = member.voice.channel;
                        if (ch.parentId !== "1155489858479988867") return interaction.reply({ content: "You're in incorrect category!" })
                        ch.setBitrate(64000)
                        await interaction.reply({ content: "Your channel's bitrate was setted on **64kbps**", ephemeral: true })
                    }
                    if (p === '128kb') {
                        let member = interaction.guild.members.cache.get(interaction.user.id);
                        if (member.user.bot) return;
                        let ch = member.voice.channel;
                        if (ch.parentId !== "1155489858479988867") return interaction.reply({ content: "You're in incorrect category!" })
                        ch.setBitrate(128000)
                        await interaction.reply({ content: "Your channel's bitrate was setted on **128kbps**", ephemeral: true })
                    }
                    if (p === '256kb') {
                        let member = interaction.guild.members.cache.get(interaction.user.id);
                        if (member.user.bot) return;
                        let ch = member.voice.channel;
                        if (ch.parentId !== "1155489858479988867") return interaction.reply({ content: "You're in incorrect category!" })
                        ch.setBitrate(256000)
                        await interaction.reply({ content: "Your channel's bitrate was setted on **256kbps**", ephemeral: true })
                    }
                    if (p === '384kb') {
                        let member = interaction.guild.members.cache.get(interaction.user.id);
                        if (member.user.bot) return;
                        let ch = member.voice.channel;
                        if (ch.parentId !== "1155489858479988867") return interaction.reply({ content: "You're in incorrect category!" })
                        ch.setBitrate(384000)
                        await interaction.reply({ content: "Your channel's bitrate was setted on **384kbps**", ephemeral: true })
                    }
                }
            }
        }

        if (interaction.customId == "online_top") {
            let users = await User.find({ guild: interaction.guild.id, voice: { $ne: null } }).sort({ voice: -1 }).limit(10)
            let text = '';
            let userss = await User.findOne({ userID: interaction.user.id, guild: interaction.guild.id }) || new User({ userID: interaction.user.id, guild: interaction.guild.id });
            let n = 0;
            for (const user of users) {
                n++;

                let u = interaction.guild.members.cache.get(user.userID);
                if (!u) {
                    await User.deleteOne({ userID: user.userID, guild: interaction.guild.id })
                    break;
                }
                let a = u.user.username || "empty";
                let time = user.voice
                time /= 1000;
                const hours = Math.floor(time / 3.6e3);
                const minutes = Math.floor(time / 60) % 60;
                const seconds = Math.floor(time % 60);
                text += `**#${n}. ${a}**\n${hours} h. ${minutes} m. ${seconds} s.\n\n`;
            };

            let top = await User.find({ voice: { $gte: userss.voice } }).countDocuments();
            if (!top) top = "unknown"
            const button = new ButtonBuilder()
                .setLabel("Close top")
                .setStyle(ButtonStyle.Danger)
                .setCustomId("close_top")

            let button2 = new ButtonBuilder()
                .setLabel("Messages top")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("msg_top")
            const row = new ActionRowBuilder()
                .addComponents(button2)
                .addComponents(button)

            let embed = new EmbedBuilder()
            embed.setTitle(`Top 10 voice active`)
                .setFooter({ text: `Your position - ${top}` })
                .setDescription(text)
                .setColor("#2b2d31")
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            interaction.update({ embeds: [embed], components: [row] })
        }
        if (interaction.customId == "msg_top") {
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
            interaction.update({ embeds: [embed], components: [row] })
        }
        if (interaction.customId == "close_top") {
            await interaction.message.delete();
        }
        if (interaction.customId == "unmute_user") {
            let target = interaction.message.embeds[0].fields[0].value
            let member = target.replace(/[^0-9]/g, "");
            const mute_user = interaction.guild.members.cache.get(member)
            mute_user.disableCommunicationUntil(null)
            await interaction.reply({ content: `<@${member}> was unmuted!`, ephemeral: true })
            let ch = interaction.guild.channels.cache.get("1155086878383550524")
            let emb = new EmbedBuilder()
                .setDescription(`<@${member}> was unmuted`)
                .addFields({
                    name: "> Moderator",
                    value: `<@${interaction.user.id}>`
                })
                .setColor("#2b2d31")
            await ch.send({ embeds: [emb] })
        } if (interaction.customId == "user_ban") {
            let target = interaction.message.embeds[0].fields[0].value
            let member = target.replace(/[^0-9]/g, "");
            let db_user = await User.findOne({ userID: member, guild: interaction.guild.id })
            if (db_user.ban == true) {
                return interaction.update({ content: `<@${member}> already in ban`, embeds: [], ephemeral: true, components: [] })
            }
            const modal = new ModalBuilder()
                .setCustomId("ban_modal")
                .setTitle("Ban info");
            const b1 = new TextInputBuilder()
                .setCustomId("reason_ban")
                .setLabel("Type reason")
                .setStyle(TextInputStyle.Short);
            const b2 = new TextInputBuilder()
                .setCustomId("duration_ban")
                .setLabel("Type duration")
                .setStyle(TextInputStyle.Short);
            const row = new ActionRowBuilder()
                .addComponents(b1);
            const row2 = new ActionRowBuilder()
                .addComponents(b2);
            modal.addComponents(row, row2);

            await interaction.showModal(modal);
        } if (interaction.customId == "ban_modal") {
            let target = interaction.message.embeds[0].fields[0].value
            let member = target.replace(/[^0-9]/g, "");
            const ban_user = interaction.guild.members.cache.get(member)
            let reason = interaction.fields.getTextInputValue("reason_ban");
            let time = parseFloat(interaction.fields.getTextInputValue("duration_ban"));
            const date = new Date()
            if (isNaN(time) == true) return interaction.reply({ content: `Choose real ban duration!`, ephemeral: true })
            if (time < 10 || time > 30) {
                return interaction.reply({ content: "Choose ban duration between 10 and 30", ephemeral: true });
            }
            let db_user = await User.findOne({ userID: member, guild: interaction.guild.id })
            db_user.ban = true
            db_user.ban_date = date.setDate(date.getDate() + time);
            db_user.ban_reason = reason
            db_user.save()
            ban_user.roles.cache.forEach(r => { if (!r.managed && r.id !== "1154873343124717649") ban_user.roles.remove(r.id) })
            ban_user.roles.add("1157923478876475474")
            await interaction.reply({
                content: `<@${member}> was banned for reason \`${reason}\`\n> Ban duration: ${time} days`,
                ephemeral: true
            })
            let ch = interaction.guild.channels.cache.get("1155086785882365972")
            let emb = new EmbedBuilder()
                .setDescription(`<@${member}> was banned for reason \`${reason}\``)
                .addFields({
                    name: "> Duration",
                    value: `${time}`
                })
                .addFields({
                    name: "> Moderator",
                    value: `<@${interaction.user.id}>`
                })
                .setColor("#2b2d31")
            await ch.send({ embeds: [emb] })
        } if (interaction.customId == "unban_user") {
            let target = interaction.message.embeds[0].fields[0].value
            let member = target.replace(/[^0-9]/g, "");
            const ban_user = interaction.guild.members.cache.get(member)
            let db_user = await User.findOne({ userID: member, guild: interaction.guild.id })
            if (db_user.ban == false) {
                return interaction.update({ content: `<@${member}> already unbanned`, embeds: [], ephemeral: true, components: [] })
            }
            db_user.ban = false;
            db_user.ban_reason = null
            db_user.ban_date = null
            db_user.save();
            ban_user.roles.remove("1157923478876475474")
            ban_user.roles.add("1154908829318905886")
            await interaction.reply({ content: `<@${member}> now is unbanned`, ephemeral: true })
            let ch = interaction.guild.channels.cache.get("1155086785882365972")
            let emb = new EmbedBuilder()
                .setDescription(`<@${member}> was unbanned`)
                .addFields({
                    name: "> Moderator",
                    value: `<@${interaction.user.id}>`
                })
                .setColor("#2b2d31")
            await ch.send({ embeds: [emb] })
        }
        if (interaction.customId == "warn_user") {

            const modal = new ModalBuilder()
                .setCustomId("warn_modal")
                .setTitle("warn info");
            const b1 = new TextInputBuilder()
                .setCustomId("reason_warn")
                .setLabel("Type reason")
                .setStyle(TextInputStyle.Short);
            const row = new ActionRowBuilder()
                .addComponents(b1);
            modal.addComponents(row);

            await interaction.showModal(modal);
        }
        if (interaction.isModalSubmit() && interaction.customId == "warn_modal") {
            let reason = interaction.fields.getTextInputValue("reason_warn");
            let target = interaction.message.embeds[0].fields[0].value
            let member = target.replace(/[^0-9]/g, "");
            const ban_user = interaction.guild.members.cache.get(member)
            const date = new Date()
            let db_user = await User.findOne({ userID: member, guild: interaction.guild.id })
            db_user.warns++
            db_user.save()
            await interaction.reply({
                content: `<@${member}> received warn for reason \`${reason}\`, now he/she has: ${db_user.warns} warns`, ephemeral: true
            })
            let ch = interaction.guild.channels.cache.get("1155136861807841310")
            let emb = new EmbedBuilder()
                .setDescription(`<@${member}> was warned for reason \`${reason}\``)
                .addFields({
                    name: "> Total warns",
                    value: `${db_user.warns}`
                })
                .addFields({
                    name: "> Moderator",
                    value: `<@${interaction.user.id}>`
                })
                .setColor("#2b2d31")
            await ch.send({ embeds: [emb] })
            if (db_user.warns == 3) {
                db_user.ban = true
                db_user.ban_date = date.setDate(date.getDate() + 30)
                db_user.ban_reason = "3 warns"
                db_user.warns = 0
                db_user.save()
                await interaction.followUp({
                    content: `<@${member}> was banned for reason,\`3 warns\`\n> Ban duration: 30 days`, ephemeral: true
                })
                ban_user.roles.cache.forEach(r => { if (!r.managed && r.id !== "1154873343124717649") ban_user.roles.remove(r.id) })
                ban_user.roles.add("1157923478876475474")
                let ch = interaction.guild.channels.cache.get("1155086785882365972")
                let emb = new EmbedBuilder()
                    .setDescription(`<@${member}> was banned for reason \`3 warns\``)
                    .addFields({
                        name: "> Duration",
                        value: `30 days`
                    })
                    .addFields({
                        name: "> Moderator",
                        value: `<@${interaction.user.id}>`
                    })
                    .setColor("#2b2d31")
                await ch.send({ embeds: [emb] })
            }
        }
        if (interaction.customId == "unwarn_user") {
            let target = interaction.message.embeds[0].fields[0].value
            let member = target.replace(/[^0-9]/g, "");
            const ban_user = interaction.guild.members.cache.get(member)
            let db_user = await User.findOne({ userID: member, guild: interaction.guild.id })
            db_user.warns--
            db_user.save()
            await interaction.reply({ content: `Successfully removed 1 warn from <@${member}>\n Now he/she has ${db_user.warns} warns`, ephemeral: true })
            let ch = interaction.guild.channels.cache.get("1155136861807841310")
            let emb = new EmbedBuilder()
                .setDescription(`<@${member}> was unwarned`)
                .addFields({
                    name: "> Total warns",
                    value: `${db_user.warns}`
                })
                .addFields({
                    name: "> Moderator",
                    value: `<@${interaction.user.id}>`
                })
                .setColor("#2b2d31")
            await ch.send({ embeds: [emb] })
        }
    });
};