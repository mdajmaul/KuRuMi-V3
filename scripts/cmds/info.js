const fs = require('fs');
const moment = require('moment-timezone');

module.exports = {
	config: {
		name: "info",
		aliases: ["owner", "binfo", "ainfo"],
		version: "2.2",
		author: "Mohammad ajmaul",
		countDown: 5,
		role: 0,
		category: "owner"
	},

	onStart: async function ({ message }) {

		// 👑 USERS
		const users = [
			{
				name: "**",
				age: "**",
				status: "𝐒𝐢𝐧𝐠𝐥𝐞",
				number: "𝟎𝟏9𝐱𝐱𝐱𝐱𝐱83",
				telegram: "************",
       facebook: "***********",
				instagram: "**********",
				role: "𝐀𝐝𝐦𝐢𝐧",
				img: ["https://files.catbox.moe/4odpv8.jpg"]
			},
			{
				name: "Mohammad ajmaul",
				age: "18+",
				status: "𝐁𝐮𝐬𝐲",
				number: "𝟎𝟏3xxxxxxx",
				telegram: "https://t.me/ajmaul2372",
       facebook: " https://www.facebook.com/profile.php?id=61590001468913",
				instagram: "hide",
				role: "𝐎𝐩𝐞𝐫𝐚𝐭𝐨𝐫",
				img: ["https://files.catbox.moe/7pl10a.jpg"]
			}
		];

		// 🎲 Random user select
		const randomUser = users[Math.floor(Math.random() * users.length)];

		// ✅ Safe image select
		const validImgs = randomUser.img.filter(url => url && url.startsWith("http"));
		const randomImg = validImgs[Math.floor(Math.random() * validImgs.length)];

		// 🕒 Time
		const now = moment().tz('Asia/Dhaka');
		const date = now.format('MMMM Do YYYY');
		const time = now.format('h:mm:ss A');

		// ⚙️ Uptime
		const uptime = process.uptime();
		const seconds = Math.floor(uptime % 60);
		const minutes = Math.floor((uptime / 60) % 60);
		const hours = Math.floor((uptime / 3600) % 24);
		const days = Math.floor(uptime / 86400);
		const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

		// 📩 Reply
		message.reply({
			body: `✨• [ 𝐁𝐨𝐭 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 ]✨
╰‣ 𝐁𝐨𝐭 𝐍𝐚𝐦𝐞: ${global.GoatBot.config.nickNameBot}
╰‣ 𝐏𝐫𝐞𝐟𝐢𝐱: ${global.GoatBot.config.prefix}

━━━━━━━━━━━━━━━
👤 • [ 𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 ]
╰‣ 𝐍𝐚𝐦𝐞:亗 ${randomUser.name} 亗
╰‣ 𝐀𝐠𝐞: ${randomUser.age}
╰‣ 𝐏𝐨𝐭𝐢𝐨𝐧: ${randomUser.role}
╰‣ 𝐒𝐭𝐚𝐭𝐮𝐬: ${randomUser.status}
╰‣ 𝐖𝐡𝐚𝐭𝐬𝐚𝐩𝐩: ${randomUser.number}
╰‣ 𝐓𝐞𝐥𝐞𝐠𝐫𝐚𝐦: ${randomUser.telegram}
╰‣ 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤: ${randomUser.facebook}
╰‣ 𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦: @${randomUser.instagram}

━━━━━━━━━━━━━━━
╰‣𝐃𝐚𝐭𝐞: ${date}
╰‣ 𝐓𝐢𝐦𝐞: ${time}
╰‣ 𝐔𝐩𝐭𝐢𝐦𝐞: ${uptimeString}
━━━━━━━━━━━━━━━`,
			attachment: await global.utils.getStreamFromURL(randomImg)
		});
	},

	onChat: async function ({ event, message }) {
		if (event.body && event.body.toLowerCase() === "info") {
			this.onStart({ message });
		}
	}
};
