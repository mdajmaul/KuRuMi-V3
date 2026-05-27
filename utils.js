function message(api, event) {
	async function sendMessageError(err) {
		if (typeof err === "object" && !err.stack)
			err = utils.removeHomeDir(JSON.stringify(err, null, 2));
		else
			err = utils.removeHomeDir(`${err.name || err.error}: ${err.message}`);

		return await api.sendMessage(
			utils.getText("utils", "errorOccurred", err),
			event.threadID,
			event.messageID
		);
	}

	// 🧠 cooldown system (anti spam + human behavior)
	if (!global.__cooldown) global.__cooldown = {};
	const userID = event.senderID;
	const now = Date.now();

	const baseDelay = Math.floor(Math.random() * 2000) + 1500; // 1.5s - 3.5s
	let extraDelay = 0;

	if (global.__cooldown[userID]) {
		const diff = now - global.__cooldown[userID];
		if (diff < 5000) extraDelay = 1200;
	}

	global.__cooldown[userID] = now;

	// 🧠 typing simulation (safe)
	const typingOn = async () => {
		try {
			await api.sendTypingIndicator(event.threadID, true);
		} catch {}
	};

	const typingOff = async () => {
		try {
			await api.sendTypingIndicator(event.threadID, false);
		} catch {}
	};

	// ⏱ human-like delay engine
	const humanDelay = async (text = "") => {
		const lengthFactor = Math.min(text.length * 15, 3000);
		const randomJitter = Math.floor(Math.random() * 800);

		const delay = baseDelay + extraDelay + lengthFactor + randomJitter;

		await typingOn();
		await new Promise(r => setTimeout(r, delay));
		await typingOff();
	};

	return {
		send: async (form, callback) => {
			try {
				global.statusAccountBot = "good";

				await humanDelay(typeof form === "string" ? form : "");

				return await api.sendMessage(form, event.threadID, callback);
			} catch (err) {
				if (JSON.stringify(err).includes("spam")) {
					setErrorUptime();
					throw err;
				}
			}
		},

		reply: async (form, callback) => {
			try {
				global.statusAccountBot = "good";

				await humanDelay(typeof form === "string" ? form : "");

				return await api.sendMessage(
					form,
					event.threadID,
					callback,
					event.messageID
				);
			} catch (err) {
				if (JSON.stringify(err).includes("spam")) {
					setErrorUptime();
					throw err;
				}
			}
		},

		unsend: async (messageID, callback) =>
			await api.unsendMessage(messageID, callback),

		reaction: async (emoji, messageID, callback) => {
			try {
				global.statusAccountBot = "good";
				return await api.setMessageReaction(emoji, messageID, callback, true);
			} catch (err) {
				if (JSON.stringify(err).includes("spam")) {
					setErrorUptime();
					throw err;
				}
			}
		},

		err: async (err) => await sendMessageError(err),
		error: async (err) => await sendMessageError(err)
	};
}
