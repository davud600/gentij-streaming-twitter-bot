import StreamerTwitterBotParams from "./interfaces/streamer-twitter-bot.interface";
import TwitchServiceParams from "./interfaces/twitch.params.interface";
import TwitterServiceParams from "./interfaces/twitter.params.interface";
import TwitchService from "./twitch.service";
import TwitterService from "./twitter.service";

export default class StreamerTwitterBot {
    private TwitchService: TwitchService;
    private TwitterService: TwitterService;

    /**
     * Update frequency (increase for less resource consumption)
     * Default set to one minute
     */
    private intervalTimeMillisec: number = 60 * 1000;

    private wasLive: boolean;
    private isLive: boolean;
    private amountOfhoursLive = 0;

    constructor({
        twitchServiceParams,
        twitterServiceParams,
        intervalTimeMillisec
    }: StreamerTwitterBotParams) {
        this.initTwitchService(twitchServiceParams);
        this.initTwitterService(twitterServiceParams);

        this.intervalTimeMillisec = intervalTimeMillisec;
    }

    /**
     * Starts loop to run program
     */
    public async start() {
        while (true) {
            console.log("Interval Called");

            try {
                if (this.isLive && !this.wasLive) {
                    this.TwitterService.makeTweet();
                    this.wasLive = true;
                } else if (this.isLive && this.wasLive) {
                } else if (!this.isLive && this.wasLive) {
                    this.wasLive = false;
                }
            } catch (e: any) {
                console.error(e);
            }

            await new Promise(resolve =>
                setTimeout(resolve, this.intervalTimeMillisec)
            );
        }
    }

    /**
     * Initialise twitch serivce
     * @param twitchServiceParams Twitch options
     */
    private initTwitchService(twitchServiceParams: TwitchServiceParams): void {
        this.TwitchService = new TwitchService(twitchServiceParams);
    }

    /**
     * Initialise twitter service
     * @param twitterServiceParams Twitter options
     */
    private initTwitterService(
        twitterServiceParams: TwitterServiceParams
    ): void {
        this.TwitterService = new TwitterService(twitterServiceParams);
    }
}
