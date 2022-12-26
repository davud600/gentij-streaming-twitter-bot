import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import Twit from "twit";

const username = "realgafi";
const intervalTimeMillisec = 10 * 1000;
// const tweetStatus =
//     "Gentij is now streaming live on twitch, GO WATCH!   https://www.twitch.tv/gentij";
const tweetStatus = "testtt (when does it get better)";
let wasLive;

dotenv.config();

const app = express();

app.use(cors());

const T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const GET_TOKEN_URL = process.env.TWTICH_GET_TOKEN_URL;
const API_URL = process.env.TWITCH_API_URL;
const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

async function getAccessToken() {
    let data;
    const headers = {
        "Content-Type": "application/json"
    };
    const body = {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "client_credentials"
    };

    try {
        const res = await fetch(`${GET_TOKEN_URL}`, {
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

async function isStreamerLive() {
    const Token = await getAccessToken();

    let data;
    const headers = {
        "Content-Type": "application/json",
        "Client-Id": CLIENT_ID,
        Authorization: `Bearer ${Token}`
    };

    try {
        const response = await fetch(`${API_URL}?user_login=${username}`, {
            headers
        });
        data = await response.json();
    } catch (e) {
        console.error(e);
    }

    return data?.data?.find(s => s.user_login === username.toLocaleLowerCase());
}

export function run() {
    setInterval(async () => {
        console.log("Interval called");

        try {
            const data = await isStreamerLive();
            const isGentijLive = data !== null && data !== undefined;

            if (isGentijLive && !wasLive) {
                // Twitter api call to make tweet
                T.post(
                    "statuses/update",
                    {
                        status: `${tweetStatus} (${new Date().toLocaleDateString(
                            "en-US"
                        )})`
                    },
                    function (e, data, res) {
                        if (e) console.error(e);

                        // console.log("---- Twitter api log START ----");
                        // console.log("--- data ---");
                        // console.log(data);
                        // console.log("--- response ---");
                        // console.log(res);
                        // console.log("---- Twitter api log END ----");
                    }
                );

                wasLive = true;
            } else if (!isGentijLive && wasLive) {
                wasLive = false;
            }
        } catch (e) {
            console.error(e);
        }
    }, intervalTimeMillisec);
}

app.listen(() => {
    console.log(`Server is running at port: ${process.env.PORT || 5000}`);

    run();
});
