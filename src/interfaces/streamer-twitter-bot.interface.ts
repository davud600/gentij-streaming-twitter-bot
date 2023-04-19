import TwitchServiceParams from "./twitch.params.interface";
import TwitterServiceParams from "./twitter.params.interface";

export default interface StreamerTwitterBotParams {
    twitchServiceParams: TwitchServiceParams;
    twitterServiceParams: TwitterServiceParams;
    intervalTimeMillisec?: number; // default 60 seconds
}
