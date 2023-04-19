import Twit from "twit";
import {
    TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET,
    TWITTER_ACCESS_TOKEN_KEY,
    TWITTER_ACCESS_TOKEN_SECRET
} from "./config/env";
import TwitterServiceParams, {
    TwitchLink
} from "./interfaces/twitter.params.interface";

export default class TwitterService {
    /**
     * Twitter api
     */
    private T: Twit;

    /**
     * Boilerplate text for tweet
     */
    private tweetStatus: string;

    /**
     * Twitch channel link
     */
    private twitchChannelLink: TwitchLink | null;

    /**
     * Bonus text depending on stream schedule
     */
    private earlyStreamTextOptions: string[] | null;
    private lateStreamTextOptions: string[] | null;
    private normalStreamTextOptions: string[] | null;

    public constructor({
        tweetStatus,
        twitchChannelLink,
        earlyStreamTextOptions,
        lateStreamTextOptions,
        normalStreamTextOptions
    }: TwitterServiceParams) {
        const T = new Twit({
            consumer_key: TWITTER_CONSUMER_KEY as string,
            consumer_secret: TWITTER_CONSUMER_SECRET as string,
            access_token: TWITTER_ACCESS_TOKEN_KEY as string,
            access_token_secret: TWITTER_ACCESS_TOKEN_SECRET as string
        });

        this.tweetStatus = tweetStatus;
        this.twitchChannelLink = twitchChannelLink;
        this.earlyStreamTextOptions = earlyStreamTextOptions;
        this.lateStreamTextOptions = lateStreamTextOptions;
        this.normalStreamTextOptions = normalStreamTextOptions;
    }

    /**
     * Build status and send tweet using twitter api
     */
    public async makeTweet(): Promise<void> {
        const date = new Date();

        let randomText = "";

        if (this.lateStreamTextOptions !== null && date.getHours() >= 22)
            randomText = this.getRandomText(this.lateStreamTextOptions);
        else if (this.earlyStreamTextOptions !== null && date.getHours() <= 19)
            randomText = this.getRandomText(this.earlyStreamTextOptions);
        else if (this.normalStreamTextOptions !== null)
            randomText = this.getRandomText(this.normalStreamTextOptions);

        this.T.post(
            "statuses/update",
            {
                status: `${this.tweetStatus} ${randomText} (${date
                    .toString()
                    .substring(0, 25)})
            ${this.twitchChannelLink}`
            },
            (e: any, data: any, res: any) => {
                if (e) console.error(e);

                console.log("---- Twitter api log START ----");
                console.log("--- data ---");
                console.log(data);
                console.log("--- response ---");
                console.log(res);
                console.log("---- Twitter api log END ----");
            }
        );
    }

    /**
     * @param textOptions array of text vars
     * @returns random text from array
     */
    private getRandomText(textOptions: string[]): string {
        let text = textOptions[0];
        let randomNums: number[] = [];

        for (let i = 0; i < textOptions.length; i++) {
            randomNums[i] = Math.round(Math.random() * 10); // random num 0-9

            if (i == 0 || randomNums[i - 1] > randomNums[i]) continue;

            text = textOptions[i];
        }

        return text;
    }
}
