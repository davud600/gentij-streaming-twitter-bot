import { schedule } from "@netlify/functions";
import Twit from "twit";
import fetch from "node-fetch";

const earlyStreamTextOptions = [
    "early stream? who is this guy.",
    "w sleep schedule.",
    "early stream :D."
];
const lateStreamTextOptions = [
    "rip sleep schedule.",
    "grinding no sleep.",
    "late stream :D."
];
const normalStreamTextOptions = [];
// const tweetStatus =
//     "Gentij is now Streaming Live on Twitch, go watch! https://www.twitch.tv/gentij";
const tweetStatus = "gentij is not streaming this is just a test,";
const username = "xqc";

let wasLive;

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

function getQuirkyText(textOptions) {
    let text = textOptions[0];
    let randomNums = [];

    for (let i = 0; i < textOptions.length; i++) {
        randomNums[i] = (Math.random() * 10).round(); // random num 0-9

        if (i == 0 || randomNums[i - 1] > randomNums[i]) {
            continue;
        }

        text = textOptions[i];
    }

    return text;
}

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

// export const handler = schedule("* * * * *", async event => {
async function run() {
    console.log("Interval called");

    try {
        const data = await isStreamerLive();
        const isGentijLive = data !== null && data !== undefined;

        if (isGentijLive && !wasLive) {
            // Twitter api call to make tweet
            const date = new Date();
            let quirkyText = "";

            if (date.getHours() >= 22) {
                quirkyText = getQuirkyText(lateStreamTextOptions);
            } else if (date.getHours() <= 19) {
                quirkyText = getQuirkyText(earlyStreamTextOptions);
            } else {
                quirkyText = getQuirkyText(normalStreamTextOptions);
            }

            T.post(
                "statuses/update",
                {
                    status: `${tweetStatus}, ${quirkyText} (${date
                        .toString()
                        .substring(0, 25)})`
                },
                (e, data, res) => {
                    if (e) console.error(e);

                    console.log("---- Twitter api log START ----");
                    console.log("--- data ---");
                    console.log(data);
                    console.log("--- response ---");
                    console.log(res);
                    console.log("---- Twitter api log END ----");
                }
            );

            wasLive = true;
        } else if (!isGentijLive && wasLive) {
            wasLive = false;
        }
    } catch (e) {
        console.error(e);
    }

    return {
        statusCode: 200
    };
}
// });

while (true) {
    await new Promise(resolve => setTimeout(resolve, intervalTimeMillisec));

    run();
}
