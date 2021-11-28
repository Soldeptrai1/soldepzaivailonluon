module.exports.config = {
	name: "joinNoti",
	eventType: ["log:subscribe"],
	version: "1.0.4",
	credits: "Mirai Team",
	description: "Thông báo bot hoặc người vào nhóm",
	dependencies: {
		"fs-extra": ""
	}
};

module.exports.run = async function({ api, event, Users }) {
	const { join } = global.nodemodule["path"];
	const { threadID } = event;
	if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
		api.changeNickname(`[ ${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? "Bypass bởi Mai Huy Bảo" : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
		return api.sendMessage(`Đ𝑎̃ 𝑘𝑒̂́𝑡 𝑛𝑜̂́𝑖 𝑣𝑜̛́𝑖 𝑏𝑜𝑥 𝑡ℎ𝑎̀𝑛ℎ 𝑐𝑜̂𝑛𝑔 ✅
----------------------
𝑉𝑢𝑖 𝑙𝑜̀𝑛𝑔 𝑠𝑢̛̉ 𝑑𝑢̣𝑛𝑔 𝑙𝑒̣̂𝑛ℎ: .menu đ𝑒̂̉ 𝑏𝑖𝑒̂́𝑡 𝑡𝑜𝑎̀𝑛 𝑏𝑜̣̂ 𝑙𝑒̣̂𝑛ℎ 𝑐𝑢̉𝑎 𝐵𝑜𝑡
❗Đừng có mà chửi bot sẽ bị ban vĩnh viễn ☠
👀Cấm spam nhiều lệnh trong 1 phút
Không thêm 2 bot cùng box phát hiện = ban 
◆━━━━━━━━━━━━━◆
𝐶𝑎̉𝑚 𝑜̛𝑛 đ𝑎̃ 𝑠𝑢̛̉ 𝑑𝑢̣𝑛𝑔 𝑏𝑜𝑡 𝑐𝑢̉𝑎 𝙉𝙜𝙪𝙮𝙚̂̃𝙣 𝙏𝙝𝙚̂́ 𝙉𝙖𝙢
𝐴𝑑𝑚𝑖𝑛 𝑏𝑜𝑡 𝐹𝐵: https://www.facebook.com/profile.php?id=100073162964978
ℂ𝕙𝕦́ 𝕪́: Đ𝕠̣𝕔 𝕜𝕚̃ 𝕥𝕣𝕒́𝕟𝕙 𝕥𝕣𝕦̛𝕠̛̀𝕟𝕘 𝕙𝕠̛̣𝕡 𝔹𝔸ℕ 𝔹𝕆𝕏 + 𝔹𝔸ℕ 𝕌𝕊𝔼ℝ`, threadID);
	}
	else {
		try {
			const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];
			let { threadName, participantIDs } = await api.getThreadInfo(threadID);

			const threadData = global.data.threadData.get(parseInt(threadID)) || {};
			const path = join(__dirname, "cache", "joinGif");
			const pathGif = join(path, `join.mp4`);

			var mentions = [], nameArray = [], memLength = [], i = 0;
			
			for (id in event.logMessageData.addedParticipants) {
				const userName = event.logMessageData.addedParticipants[id].fullName;
				nameArray.push(userName);
				mentions.push({ tag: userName, id });
				memLength.push(participantIDs.length - i++);

				if (!global.data.allUserID.includes(id)) {
					await Users.createData(id, { name: userName, data: {} });
					global.data.userName.set(id, userName);
					global.data.allUserID.push(id);
				}
			}
			memLength.sort((a, b) => a - b);
			
			(typeof threadData.customJoin == "undefined") ? msg = "𝙒𝙚𝙡𝙘𝙤𝙢𝙚 {name} 🥳.\n𝗖𝗵𝗮̀𝗼 𝗺𝘂̛̀𝗻𝗴 𝗰𝗼𝗻 𝘃𝗼̛̣ 𝗻𝗮̀𝘆 đ𝗲̂́𝗻 𝘃𝗼̛́𝗶 𝗻𝗵𝗼́𝗺 {threadName} 🥰.\n{type}𝗹𝗮̀ 𝘁𝗵𝗮̀𝗻𝗵 𝘃𝗶𝗲̂𝗻 𝘁𝗵𝘂̛́ {soThanhVien} 𝗰𝘂̉𝗮 𝗻𝗵𝗼́𝗺 𝘅𝗮̀𝗺 𝘅𝗶́ đ𝘂́ 𝗻𝗮̀𝘆 🥳." : msg = threadData.customJoin;
			msg = msg
			.replace(/\{name}/g, nameArray.join(', '))
			.replace(/\{type}/g, (memLength.length > 1) ?  'các bạn' : '𝙗𝙖̣𝙣')
			.replace(/\{soThanhVien}/g, memLength.join(', '))
			.replace(/\{threadName}/g, threadName);

			if (existsSync(path)) mkdirSync(path, { recursive: true });

			if (existsSync(pathGif)) formPush = { body: msg, attachment: createReadStream(pathGif), mentions }
			else formPush = { body: msg, mentions }

			return api.sendMessage(formPush, threadID);
		} catch (e) { return console.log(e) };
	}
}
