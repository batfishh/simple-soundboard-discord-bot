# Simple Soundboard Discord Bot

This NodeJS script can be used to play audio clips in a discord channel, with a command.


# Setup

 - pre-requisites - NodeJS, ffmpeg [Download here](https://ffmpeg.org/download.html)
 - Create .env in root folder - keys mentioned below in the readme
 - `npm install`
 - `npm start`
 - sounds folder contains a JSON with all audio file names and the files itself.
 - To add a new sound just paste the mp3 in the sounds folder and update entry in `sounds.js` with an integer mapping to the audio
 - run `.-ssb <number>`



## Environment Variables
Create a ".env" file with the keys given below : 

    DISCORD_TOKEN=<this is your bots discord token>
