import { userTable } from "../utilities/signals";
import { mediaInfo } from "../Components/UserMedia";
import { mediaType, setMediaLoading } from "../utilities/signals";
import { fetchUserMedia } from "../api/anilist";

const userDataSaved = {};

export async function updateMediaInfoObject(...newUsers) {
	const users = [...userTable(), ...newUsers];

	for (const user of users) {
		const key = user.name + mediaType();
		if (userDataSaved[key]) continue;
		setMediaLoading(true);
		userDataSaved[key] = true;

		const userMedia = await fetchUserMedia(user, mediaType());
		const rewatchedList = { name: "Rewatched", entries: [], isCustomList: false };
		for (const list of userMedia) {
			const listKey = list.isCustomList ? "Custom" : list.name;
			for (const userStats of list.entries) {
				const mediaKey = userStats.media.id;
				const userKey = user.name;

				if (mediaKey in mediaInfo) {
					mediaInfo[mediaKey].userLists[userKey] ??= {};
					mediaInfo[mediaKey].userLists[userKey][listKey] = true;
					mediaInfo[mediaKey].userScores[userKey] = userStats.score;
					mediaInfo[mediaKey].userRepeats[userKey] = userStats.repeat;
					if (userStats.repeat && !mediaInfo[mediaKey].userLists[userKey]["Rewatched"]) {
						rewatchedList.entries.push(userStats);
						mediaInfo[mediaKey].userLists[userKey]["Rewatched"] = true;
					}
					continue;
				}

				userStats.media.season = userStats.media.season?.[0].toUpperCase() + userStats.media.season?.substring(1).toLowerCase() || "";
				if (
					userStats.media.format &&
					userStats.media.format !== "TV" &&
					userStats.media.format !== "ONA" &&
					userStats.media.format !== "OVA"
				)
					userStats.media.format = userStats.media.format[0].toUpperCase() + userStats.media.format.substring(1).toLowerCase();

				mediaInfo[mediaKey] = userStats.media;
				mediaInfo[mediaKey].userLists = { [userKey]: { [listKey]: true } };
				mediaInfo[mediaKey].userScores = { [userKey]: userStats.score };
				mediaInfo[mediaKey].userRepeats = { [userKey]: userStats.repeat };
				if (userStats.repeat) {
					rewatchedList.entries.push(userStats);
					mediaInfo[mediaKey].userLists[userKey]["Rewatched"] = true;
				}
			}
		}

		userMedia.push(rewatchedList);

		console.log(userMedia);
	}
}
