const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ===== CONFIG =====
const VERIFY_TOKEN = "your_verify_token";
const PAGE_ACCESS_TOKEN = "your_page_access_token";
const OWNER_ID = "100091050051972";

// ===== WEBHOOK VERIFY =====
app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
});

// ===== MESSAGE HANDLER =====
app.post("/webhook", async (req, res) => {
    const body = req.body;

    if (body.object === "page") {
        for (const entry of body.entry) {
            for (const event of entry.messaging) {

                if (!event.message || !event.sender) continue;

                const senderId = String(event.sender.id);
                const text = event.message.text || "";

                // ===== OWNER ONLY =====
                if (senderId !== OWNER_ID) continue;

                if (text.startsWith("!ping")) {
                    await sendMessage(senderId, "pong");
                }

                if (text.startsWith("!cmd")) {
                    await sendMessage(senderId, "Owner command executed");
                }
            }
        }

        return res.sendStatus(200);
    }

    res.sendStatus(404);
});

// ===== SEND MESSAGE =====
async function sendMessage(psid, text) {
    await axios.post(
        "https://graph.facebook.com/v19.0/me/messages",
        {
            recipient: { id: psid },
            message: { text }
        },
        {
            params: {
                access_token: PAGE_ACCESS_TOKEN
            }
        }
    );
}

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Messenger bot running on port " + PORT);
});
