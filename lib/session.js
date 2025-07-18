const fs = require('fs');
const path = require('path');
const axios = require('axios');

const token = "b682c67383283818774c7a39012d25e3f864265df99a39f9983b89381db8fc1e802d76679a4785eb33ce308fc3d2879171916ea0431ff4b82ab3060bf1ccf887";

async function MakeSession(sessionId, folderPath) {
    try {
        const pasteId = sessionId.split("~")[1];
        const rawUrl = `https://hastebin.com/raw/${pasteId}`;

        const config = {
            method: 'get',
            url: rawUrl,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await axios(config);

        if (!response.data || !response.data.content) {
            throw new Error("Empty or invalid response from Hastebin.");
        }

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const outputPath = path.join(folderPath, "creds.json");

        const dataToWrite = typeof response.data.content === "string"
            ? response.data.content
            : JSON.stringify(response.data.content);

        fs.writeFileSync(outputPath, dataToWrite);
        console.log("Session file saved successfully!");

    } catch (error) {
        console.error("An error occurred while saving session:", error.message);
    }
}

module.exports = { MakeSession };
