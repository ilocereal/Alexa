import * as Discord from 'discord.js'
import {formatTime} from "../../Utility/Util";
import * as moment from "moment";
import gb from "../../Misc/Globals";
import {Environments} from "../../Events/systemStartup";

export default function uptime(message: Discord.Message, bot : Discord.Client){
    let env : string = gb.ENV === Environments.Live ? 'cloud': 'localhost';
    const currentUptime = formatTime(message.client.uptime/1000);
    message.channel.send(`I've been online on ${env} for: ${currentUptime}`);
}