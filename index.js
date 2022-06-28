import DiscordClient from './discord-client/discord-client.js'
import dotenv from "dotenv";
dotenv.config()

const discordClient = new DiscordClient(process.env.DISCORD_TOKEN)
discordClient.connect()
discordClient.monitorMessages()