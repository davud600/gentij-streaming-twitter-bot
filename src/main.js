import Twit from "twit";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const earlyStreamTextOptions = [
    "Early stream? who is this guy.",
    "W sleep schedule.",
    "Early stream :D."
];
const lateStreamTextOptions = [
    "Rip sleep schedule.",
    "Grinding no sleep.",
    "Late stream :D."
];
const normalStreamTextOptions = [""];
const tweetStatus = "Gentij is now Streaming Live on Twitch, go watch!";
const username = "gentij";
const channelLink = `https://www.twitch.tv/${username}`;
const intervalTimeMillisec = 60 * 1000;

let wasLive;
let isLive;
let amountOfhoursLive = 0;

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
        randomNums[i] = Math.round(Math.random() * 10); // random num 0-9

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

async function run() {
    while (true) {
        console.log("Interval called");

        try {
            const data = await isStreamerLive();
            isLive = data !== null && data !== undefined;

            if (isLive && !wasLive) {
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
                        status: `${tweetStatus} ${quirkyText} (${date
                            .toString()
                            .substring(0, 25)})
                            ${channelLink}`
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
            } else if (isLive && wasLive) {
                // Tweet every hour gentij is live
                // const date = new Date();
                // if (date.getHours() < 1) return;
                // amountOfhoursLive++;
                // const hourText = amountOfhoursLive > 1 ? "hours" : "hour";
                // T.post(
                //     "statuses/update",
                //     {
                //         status: `Gentij has been Live Streaming for ${amountOfhoursLive} ${hourText}. (${date
                //             .toString()
                //             .substring(0, 25)})
                //             ${channelLink}`
                //     },
                //     (e, data, res) => {
                //         if (e) console.error(e);
                //         console.log("---- Twitter api log START ----");
                //         console.log("--- data ---");
                //         console.log(data);
                //         console.log("--- response ---");
                //         console.log(res);
                //         console.log("---- Twitter api log END ----");
                //     }
                // );
            } else if (!isLive && wasLive) {
                wasLive = false;
            }
        } catch (e) {
            console.error(e);
        }

        await new Promise(resolve => setTimeout(resolve, intervalTimeMillisec));
    }
}

run();
