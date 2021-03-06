import {Channel, GuildMember, TextChannel} from "discord.js";
import {gb} from "../../misc/Globals";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

async function run(message: Message, input: [GuildMember | Channel]): Promise<any> {
    const [target] = input;
    if (target instanceof GuildMember) {
        if (target.id === gb.ownerID) {
            return handleFailedCommand(message.channel, `${gb.emojis.get('hifumi_durr')} heY hiFuMi, PlEasE iGnOrE Xetera`);
        }

        else if (target.id === message.guild.me.id) {
            return handleFailedCommand(message.channel, `Why would you want me to ignore myself? :(`);
        }

        else if (target.hasPermission('ADMINISTRATOR')) {
            return handleFailedCommand(message.channel, `I have a really hard time ignoring admins, sorry.`);
        }

        else if (message.member.highestRole.comparePositionTo(target.highestRole) < 0 && !message.member.hasPermission('ADMINISTRATOR')) {
            return handleFailedCommand(message.channel, `I can't be forced to ignore users that have a higher role than you.`);
        }

        else if (target.user.bot) {
            return handleFailedCommand(message.channel, `I already ignore everything from bots.`);
        }

        const status = await gb.database.isUserIgnored(target);
        try {
            await gb.database.setUserIgnore(target, !status);
        }
        catch (err) {
            console.log(err);
            return handleFailedCommand(message.channel, `There was an unexpected error while trying to ignore that.`);
        }

        if (!status)
            safeSendMessage(message.channel, `Ignoring everything from ${target.user.username}.`);
        else
           safeSendMessage(message.channel, `Unignored ${target.user.username}`);

    }
    else if (target instanceof TextChannel) {
        if (!message.member.permissionsIn(target).has('SEND_MESSAGES')){
            return handleFailedCommand(message.channel, `I can't ignore a channel you can't send messages in.`);
        }
        const status = await gb.database.getChannelIgnored(message.guild.id, target.id);
        try {
            await gb.database.setChannelIgnored(message.guild.id, target.id, message.member.user.username, !status);
        }
        catch (err){
            console.log(err);
            return handleFailedCommand(message.channel, `There was an unexpected error while trying to ignore that.`);
        }

        if (!status)
            safeSendMessage(message.channel,`Ignoring commands and chats from ${target}.`);
        else
            safeSendMessage(message.channel, `Unignored commands and chats from ${target}`);

    }
    else {
        return handleFailedCommand(message.channel, `I can't ignore that.`)
    }
}

export const command: Command = new Command(
    {
        names: ['ignore'],
        info: 'Ignores commands from a channel or a specific user.',
        usage: '{{prefix}}ignore { channel | user }',
        examples: ['{{prefix}}ignore #general', "{{prefix}}ignore @Xetera"],
        category: 'Settings',
        expects: [
            [{type: ArgType.Member}, {type: ArgType.Channel}]
        ],
        run: run,
        userPermissions: UserPermissions.Moderator,
    }
);
