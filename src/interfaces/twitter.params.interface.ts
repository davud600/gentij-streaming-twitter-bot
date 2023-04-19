export default interface TwitterServiceParams {
    tweetStatus: string;
    twitchChannelLink?: TwitchLink | null;
    earlyStreamTextOptions?: string[] | null;
    lateStreamTextOptions?: string[] | null;
    normalStreamTextOptions?: string[] | null;
}

export type TwitchLink = `${"https://www.twitch.tv/"}${string}`;
