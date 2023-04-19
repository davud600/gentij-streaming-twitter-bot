import TwitchServiceParams from "./interfaces/twitch.params.interface";
import TwitterServiceParams from "./interfaces/twitter.params.interface";
import StreamerTwitterBot from "./streamer-twitter-bot";

const twitchServiceParams: TwitchServiceParams = {
    twitchUsername: "gentij"
};

const twitterServiceParams: TwitterServiceParams = {
    // tweetStatus: "Gentij is now Streaming Live on Twitch, go watch!"
    tweetStatus: "testing hii guyss cc:",
    twitchChannelLink: "https://www.twitch.tv/gentij",
    earlyStreamTextOptions: [
        "Early stream? who is this guy.",
        "W sleep schedule.",
        "Early stream :D."
    ],
    lateStreamTextOptions: [
        "Rip sleep schedule.",
        "Grinding no sleep.",
        "Late stream :D."
    ]
};

const streamerTwitterBot: StreamerTwitterBot = new StreamerTwitterBot({
    twitchServiceParams,
    twitterServiceParams
});

streamerTwitterBot.start();
