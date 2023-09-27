import { userTable } from "../utilities/signals";
import { mediaInfo } from "../Components/UserMedia";
import { mediaType, setMediaLoading, setAnimeUserList, setMangaUserList } from "../utilities/signals";
import { fetchUserMedia } from "../api/anilist";

const userDataSaved = {};

export async function updateMediaInfoObject(...newUsers) {
	const users = [...userTable(), ...newUsers];
	const mediaTypeValue = mediaType();

	for (const user of users) {
		const key = user.name + mediaTypeValue;
		if (userDataSaved[key]) continue;
		setMediaLoading(true);
		userDataSaved[key] = true;

		const userMedia = await fetchUserMedia(user, mediaTypeValue);
		const rewatchedList = { name: "Rewatched", entries: [], isCustomList: false };

		for (const list of userMedia) {
			const listKey = list.isCustomList ? "Custom" : list.name;
			if (mediaTypeValue === "MANGA") setMangaUserList((prev) => [...new Set([...prev, list.name])]);
			else setAnimeUserList((prev) => [...new Set([...prev, list.name])]);

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

		if (rewatchedList.entries.length) {
			userMedia.push(rewatchedList);
			if (mediaTypeValue === "MANGA") setMangaUserList((prev) => [...new Set([...prev, "Rewatched"])]);
			else setAnimeUserList((prev) => [...new Set([...prev, "Rewatched"])]);
		}

		console.log(userMedia);
	}
}
