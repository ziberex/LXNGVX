const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const User = require('../user.js');

module.exports = (client) => {
    client.on("messageCreate", async (message) => {
        const prefix = "!";
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if (command === "say") {
            if (
                message.author.id !== "818426965412413440" &&
                message.author.id !== "1052906848396783637" &&
                message.author.id !== "947586139911491635"
            )
                return message.reply("Poshel naher");
            let botmessage = args.join(" ");
            if (!botmessage) return message.channel.send("type something!");
            message.channel.send(botmessage).catch(() => { });
            message.delete();
        }
        if (command === "clear") {
            if (
                message.author.id !== "818426965412413440" &&
                message.author.id !== "1052906848396783637" &&
                message.author.id !== "947586139911491635"
            )
                return message.reply("Poshel naher");
            if (!args[0] || (args[0] && isNaN(args[0]) == true))
                return message.channel.send({
                    embeds: [
                        {
                            title: "Error ❌",
                            description: `**${message.author}, select message count!**`,
                        },
                    ],
                });
            let deleteAmount;
            if (parseInt(args[0]) > 100) {
                deleteAmount = 100;
            } else {
                deleteAmount = parseInt(args[0]) + 1;
            }
            await message.channel.bulkDelete(deleteAmount, true).catch(() => { });
            const embed = new EmbedBuilder()

                .setDescription(`Deleted ${deleteAmount} messages`)
                .setFooter({
                    text: message.author.username,
                    iconURL: message.author.avatarURL(),
                });
            await message.channel
                .send({ embeds: [embed] })
                .then(
                    (message) =>
                        setTimeout(() => {
                            message.delete();
                        }),
                    3000
                )
                .catch(() => { });
        }
        if (command === "eval") {
            if (
                message.author.id !== "818426965412413440" &&
                message.author.id !== "1052906848396783637" &&
                message.author.id !== "947586139911491635"
            )
                return message.reply("poshel naher!");

            const code = args.join(" ");
            if (!code) return message.reply("select code");
            try {
                let result = eval(code);
                let out = result;
                if (typeof result !== "string") {
                    out = inspect(result);
                }
                message.channel.send(out, { code: "js" });
            } catch (error) {
                //   message.channel.send(codeBlock(error));
                message.delete();
            }
        }
        if (args[0] == "privat_settings") {
            let guild = client.guilds.cache.get("1154873343124717649");
            let channel = guild.channels.cache.get("1155490199736946849");
            const b = new ButtonBuilder()
                .setEmoji("⠀⠀<:channel_name:1156925739254427689>⠀⠀")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("privat_1");
            const b2 = new ButtonBuilder()
                .setEmoji("⠀⠀<:channel_limit:1156925730693840968>⠀⠀")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("privat_2");
            const b3 = new ButtonBuilder()
                .setEmoji("⠀⠀<:channel_owner:1156925742827966474>⠀⠀")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("privat_3");
            const b4 = new ButtonBuilder()
                .setEmoji("⠀⠀<:channel_ban:1156925725987844237>⠀⠀")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("privat_4");
            const b5 = new ButtonBuilder()
                .setEmoji("⠀⠀<:channel_mute:1156925735550844980>⠀⠀")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("privat_5");
            const b6 = new ButtonBuilder()
                .setEmoji("⠀⠀<:channel_lock:1156925733910892666>⠀⠀")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("privat_6");
            const b7 = new ButtonBuilder()
                .setEmoji("⠀⠀<:slots_plus:1158009633236058132>⠀⠀")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("privat_7");
            const b8 = new ButtonBuilder()
                .setEmoji("⠀⠀<:slots_minus:1158009630102933616>⠀⠀")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("privat_8");
            const bitrate = new StringSelectMenuBuilder()
                .setCustomId('choose_bitrate')
                .setPlaceholder('Choose something')
                .addOptions([
                    {
                        label: "Economy",
                        description: '24 kbps',
                        value: "24kb",
                    },
                    {
                        label: "Standart",
                        description: '64 kbps',
                        value: "64kb",
                    },
                    {
                        label: "Normal quality",
                        description: '128 kbps',
                        value: "128kb",
                    },
                    {
                        label: "High quality",
                        description: '256 kbps',
                        value: "256kb",
                    },
                    {
                        label: "Best quality",
                        description: '384 kbps',
                        value: "384kb",
                    },
                ])
            const buttons = new ActionRowBuilder()
                .addComponents(b)
                .addComponents(b2)
                .addComponents(b3)
                .addComponents(b7)
            const buttons1 = new ActionRowBuilder()
                .addComponents(b4)
                .addComponents(b5)
                .addComponents(b6)
                .addComponents(b8)
            const row = new ActionRowBuilder()
                .addComponents(bitrate)
            await channel.send({
                content: null,
                tts: false,
                embeds: [
                    {
                        id: 234169547,
                        title: "・Privat voice settings",
                        color: 2829617,
                        fields: [
                            {
                                id: 690302882,
                                name: "⠀",
                                value:
                                    "<:slots_plus:1158009633236058132> — `Add 1 slot to your room`\n<:channel_name:1156925739254427689> — `change voice name`\n<:channel_limit:1156925730693840968> — `change voice limit`\n<:channel_owner:1156925742827966474> — `change voice owner`",
                                inline: true,
                            },
                            {
                                id: 722586061,
                                name: "⠀",
                                value:
                                    "<:slots_minus:1158009630102933616> — `Remove 1 slot from your room`\n<:channel_ban:1156925725987844237> — `ban/unban user in your voice`\n<:channel_mute:1156925735550844980> — `mute/unmute user in your voice`\n<:channel_lock:1156925733910892666> — `lock/unlock your channel`",
                                inline: true,
                            },
                        ],
                    },
                ],
                components: [buttons, buttons1, row],
                actions: {},
            });
        } if (args[0] == "rules") {
            const button = new ButtonBuilder()
                .setEmoji(":flag_us:")
                .setStyle(ButtonStyle.Success)
                .setCustomId("english")
            const row = new ActionRowBuilder()
                .addComponents(button)
            await message.channel.send({
                "content": null,
                "tts": false,
                "embeds": [
                    {
                        "id": 900092961,
                        "image": {
                            "url": "https://images-ext-2.discordapp.net/external/MlP5y8K3ixcqFu5A7Hv-sumixAvohxg_T2nFXhzreDI/https/i.pinimg.com/originals/ff/41/06/ff4106a1bc93e87497a489818270409c.gif?width=447&height=188"
                        },
                        "fields": [],
                        "color": 2829617
                    },
                    {
                        "id": 836891599,
                        "description": "```・                    1.1                       ・```\n\n**```・Запрещено распространение личной информации, которой нет в открытом доступе, без согласия её владельца.```**",
                        "image": {
                            "url": "https://cdn.discordapp.com/attachments/973249401185243166/1091057033089916968/image.png"
                        },
                        "fields": [],
                        "color": 2829617
                    },
                    {
                        "id": 42784122,
                        "description": "```・                    1.2                       ・```\n\n**```・Запрещена реклама аккаунтов/шопов и т.д. мы не являемся торговой площадкой.```**",
                        "image": {
                            "url": "https://cdn.discordapp.com/attachments/973249401185243166/1091057033089916968/image.png"
                        },
                        "fields": [],
                        "color": 2829617
                    },
                    {
                        "id": 471709804,
                        "description": "```・                    1.3                       ・```\n\n**```・Запрещено публиковать незаконные материалы или материалы АП.```**",
                        "image": {
                            "url": "https://cdn.discordapp.com/attachments/973249401185243166/1091057033089916968/image.png"
                        },
                        "fields": [],
                        "color": 2829617
                    },
                    {
                        "id": 184103413,
                        "description": "```・                    1.4                       ・```\n\n**```・Запрещен любой обман в целях получения личной выгоды.```**",
                        "image": {
                            "url": "https://cdn.discordapp.com/attachments/973249401185243166/1091057033089916968/image.png"
                        },
                        "fields": [],
                        "color": 2829617
                    },
                    {
                        "id": 437842149,
                        "description": "```・                    1.5                       ・```\n\n**```・Запрещено неадекватное поведение в любом его      \nпроявлении.```**",
                        "image": {
                            "url": "https://cdn.discordapp.com/attachments/973249401185243166/1091057033089916968/image.png"
                        },
                        "fields": [],
                        "color": 2829617
                    },
                    {
                        "id": 40694038,
                        "description": "```・                    1.6                       ・```\n\n**```・Запрещён флуд, спам, злоупотребление капсом, а так же несоблюдение тематики чата.```**",
                        "image": {
                            "url": "https://cdn.discordapp.com/attachments/973249401185243166/1091057033089916968/image.png"
                        },
                        "fields": [],
                        "color": 2829617
                    },
                    {
                        "id": 628952486,
                        "description": "```・   Важные примечания о которых нужно знать    ・```\n**```Наш сервер придерживается правил Discord Terms of\nService и Discord Community Guidelines, поэтому\nнастоятельно советуем вам с ними ознакомиться.```**\n\n**・[Discord Terms of Service](https://discord.com/terms)\n・[Discord Community Guidelines](https://discord.com/guidelines)**",
                        "image": {
                            "url": "https://cdn.discordapp.com/attachments/973249401185243166/1091057033089916968/image.png"
                        },
                        "fields": [],
                        "color": 2829617
                    },
                    {
                        "id": 315464852,
                        "description": "```Команда сервера оставляет за собой право удалять любой контент участника.```",
                        "image": {
                            "url": "https://cdn.discordapp.com/attachments/973249401185243166/1091057033089916968/image.png"
                        },
                        "fields": [],
                        "color": 2829617
                    }
                ],
                "components": [row],
                "actions": {},
            })
        }
    });
    client.on("messageCreate", async (message) => {
        if (!message.author || !message.guild) return;
        if (message.author.bot == true) return;
        let user = await User.findOne({ userID: message.author.id, guild: message.guild.id })
        user.msg++;
        user.save()
        console.log(user.msg)
    });
};