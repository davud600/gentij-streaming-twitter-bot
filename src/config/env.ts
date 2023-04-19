import dotenv from "dotenv";

dotenv.config();

export const {
    TWITCH_GET_TOKEN_URL,
    TWITCH_API_URL,
    TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET,
    TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET,
    TWITTER_ACCESS_TOKEN_KEY,
    TWITTER_ACCESS_TOKEN_SECRET
} = process.env;
