import dotenv from "dotenv";
import Discord from "discord.js";
import numberToEmoji from "number-to-emoji"
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} from "@discordjs/voice";
import { fileURLToPath } from "url";
import sounds from "../sounds/sounds.js";
import path from "path";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
export default class DiscordClient {
  constructor(clientToken) {
    this.clientToken = clientToken;
    this.client = new Discord.Client({
      intents: [["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]],
    });
    this.connection = null;
  }

  async connect() {
    this.client
      .login(this.clientToken)
      .then((success) => {
        console.log("Logged into discord: ", success);
      })
      .catch((err) => {
        console.log("Error in logging into discord : ", err);
      });

    this.client.on("ready", () => {
      console.log(`Discord client ready :  ${this.client.user.tag}!`);
      this.client.user.setActivity(".-ssb help", { type: "PLAYING" });
    });
  }

  async destroyConnection(){
    if(this.connection){
      this.connection.destroy()
    }
  }

  async playAudio(message, soundNumber) {
    const member = message.member;
    if (!member?.voice.channelId) {
      return message.reply("Please join a voice channel first!");
    }
    
    if (sounds[soundNumber]) {
      this.connection = joinVoiceChannel({
        channelId: member.voice.channelId,
        guildId: member.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });
      const player = createAudioPlayer();
      const resource = createAudioResource(
        path.join(__dirname, "..", "sounds", sounds[soundNumber])
      );
      console.log("Playing file : ", path.join(__dirname, sounds[soundNumber]));
      player.play(resource);
      this.connection.subscribe(player);
      player.on(AudioPlayerStatus.Idle, () => {
        this.connection.destroy();
      });
    }else{
      return message.reply("No such sound found!")
    }


  }

  async monitorMessages() {
    this.client.on("messageCreate", async (msg) => {
      if (msg.content.startsWith(".-ssb")) {
        if (msg.content.split(" ").length === 2) {
          const arg2 = msg.content.split(" ")[1].trim()
          if(arg2==="help"){
            let helpOptions = ""
            Object.keys(sounds).forEach((soundNumber)=>{
              helpOptions += `${numberToEmoji.toEmoji(soundNumber)} -> ${sounds[soundNumber]}\n`
            })
            msg.reply(`type \`\`\`.-ssb <number>\`\`\`\n Sound board numbers :\n${helpOptions} \n © https://github.com/batfishh/`)
          }
          if(arg2==="stop"){
            this.destroyConnection()
          }
          if(!isNaN(arg2)){
          const soundNumber = parseInt(arg2);
          this.playAudio(msg, soundNumber);
          }
        }else{
          msg.reply("Invalid command!")
        }
      }
    });
  }
}
