"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var twit_1 = __importDefault(require("twit"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var earlyStreamTextOptions = [
    "Early stream? who is this guy.",
    "W sleep schedule.",
    "Early stream :D."
];
var lateStreamTextOptions = [
    "Rip sleep schedule.",
    "Grinding no sleep.",
    "Late stream :D."
];
var normalStreamTextOptions = [""];
// const tweetStatus = "Gentij is now Streaming Live on Twitch, go watch!";
var tweetStatus = "testing hi guys";
var username = "gentij";
var channelLink = "https://www.twitch.tv/".concat(username);
var intervalTimeMillisec = 60 * 1000;
var wasLive;
var isLive;
var amountOfhoursLive = 0;
var T = new twit_1.default({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
var TWITCH_GET_TOKEN_URL = process.env.TWITCH_GET_TOKEN_URL;
var TWITCH_API_URL = process.env.TWITCH_API_URL;
var TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
var TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
function getQuirkyText(textOptions) {
    var text = textOptions[0];
    var randomNums = [];
    for (var i = 0; i < textOptions.length; i++) {
        randomNums[i] = Math.round(Math.random() * 10); // random num 0-9
        if (i == 0 || randomNums[i - 1] > randomNums[i])
            continue;
        text = textOptions[i];
    }
    return text;
}
function getAccessToken() {
    return __awaiter(this, void 0, void 0, function () {
        var data, headers, body, res, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = {
                        "Content-Type": "application/json"
                    };
                    body = {
                        client_id: TWITCH_CLIENT_ID,
                        client_secret: TWITCH_CLIENT_SECRET,
                        grant_type: "client_credentials"
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, node_fetch_1.default)("".concat(TWITCH_GET_TOKEN_URL), {
                            method: "POST",
                            body: JSON.stringify(body),
                            headers: headers
                        })];
                case 2:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, data === null || data === void 0 ? void 0 : data.access_token];
            }
        });
    });
}
function isStreamerLive() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var Token, data, headers, response, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getAccessToken()];
                case 1:
                    Token = _b.sent();
                    headers = {
                        "Content-Type": "application/json",
                        "Client-Id": CLIENT_ID,
                        Authorization: "Bearer ".concat(Token)
                    };
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, (0, node_fetch_1.default)("".concat(TWITCH_API_URL, "?user_login=").concat(username), {
                            headers: headers
                        })];
                case 3:
                    response = _b.sent();
                    return [4 /*yield*/, response.json()];
                case 4:
                    data = _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    e_2 = _b.sent();
                    console.error(e_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/, (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.find(function (s) { return s.user_login === username.toLocaleLowerCase(); })];
            }
        });
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var data, date, quirkyText, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 6];
                    console.log("Interval called");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, isStreamerLive()];
                case 2:
                    data = _a.sent();
                    isLive = data !== null && data !== undefined;
                    if (isLive && !wasLive) {
                        date = new Date();
                        quirkyText = "";
                        if (date.getHours() >= 22) {
                            quirkyText = getQuirkyText(lateStreamTextOptions);
                        }
                        else if (date.getHours() <= 19) {
                            quirkyText = getQuirkyText(earlyStreamTextOptions);
                        }
                        else {
                            quirkyText = getQuirkyText(normalStreamTextOptions);
                        }
                        T.post("statuses/update", {
                            status: "".concat(tweetStatus, " ").concat(quirkyText, " (").concat(date
                                .toString()
                                .substring(0, 25), ")\n                            ").concat(channelLink)
                        }, function (e, data, res) {
                            if (e)
                                console.error(e);
                            console.log("---- Twitter api log START ----");
                            console.log("--- data ---");
                            console.log(data);
                            console.log("--- response ---");
                            console.log(res);
                            console.log("---- Twitter api log END ----");
                        });
                        wasLive = true;
                    }
                    else if (isLive && wasLive) {
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
                    }
                    else if (!isLive && wasLive) {
                        wasLive = false;
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_3 = _a.sent();
                    console.error(e_3);
                    return [3 /*break*/, 4];
                case 4: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, intervalTimeMillisec); })];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 0];
                case 6: return [2 /*return*/];
            }
        });
    });
}
run();
