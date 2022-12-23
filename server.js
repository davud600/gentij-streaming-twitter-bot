import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

app.use(cors());

const GET_TOKEN_URL = process.env.TWTICH_GET_TOKEN_URL;
const API_URL = process.env.TWITCH_API_URL;
const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

const username = "gentij";

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

        console.log(data);
    } catch (e) {
        console.error(e);
    }

    return data?.data?.find(s => s.user_login === username.toLocaleLowerCase());
}

const isgentijlive = await isStreamerLive();

app.listen(() => {
    console.log(`Server is running at port: ${process.env.PORT || 5000}`);

    setInterval(() => {
        console.log("hi");
    }, 60000);
});
