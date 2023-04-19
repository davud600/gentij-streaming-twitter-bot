import fetch from "node-fetch";
import {
    TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET,
    TWITCH_GET_TOKEN_URL,
    TWITCH_API_URL
} from "./config/env";
import TwitchServiceParams from "./interfaces/twitch.params.interface";

export default class TwitchService {
    /**
     * Twitch account username
     */
    private twitchUsername: string;

    public constructor({ twitchUsername }: TwitchServiceParams) {
        this.twitchUsername = twitchUsername;
    }

    private async getAccessToken(): Promise<string> {
        let data: any;
        const headers = {
            "Content-Type": "application/json"
        };
        const body = {
            client_id: TWITCH_CLIENT_ID,
            client_secret: TWITCH_CLIENT_SECRET,
            grant_type: "client_credentials"
        };

        try {
            const res = await fetch(`${TWITCH_GET_TOKEN_URL}`, {
                method: "POST",
                body: JSON.stringify(body),
                headers
            });
            data = await res.json();
        } catch (e) {
            console.error(e);
        }

        return data?.access_token;
    }

    public async isStreamerLive(): Promise<boolean> {
        const Token = await this.getAccessToken();

        let data: any;
        const headers: any = {
            "Content-Type": "application/json",
            "Client-Id": TWITCH_CLIENT_ID,
            Authorization: `Bearer ${Token}`
        };

        try {
            const res = await fetch(
                `${TWITCH_API_URL}?user_login=${this.twitchUsername}`,
                {
                    headers
                }
            );
            data = await res.json();
        } catch (e) {
            console.error(e);
        }

        const isLive = data?.data?.find(
            (s: any) => s.user_login === this.twitchUsername.toLocaleLowerCase()
        );

        return isLive !== null && isLive !== undefined;
    }
}
