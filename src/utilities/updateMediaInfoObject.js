import { userTable } from "../Components/UserTable";
import { mediaInfo } from "../Components/UserMedia";
import { mediaType } from "../Components/MediaTypeButtons";
import { fetchUserMedia } from "../api/anilist";

const userDataSaved = {}

export async function updateMediaInfoObject(...newUsers) {
	const users = [...userTable(), ...newUsers];

	for (const user of users) {
		const key = user.name + mediaType();
		if (userDataSaved[key]) continue;
		userDataSaved[key] = true;

		const userMedia = await fetchUserMedia(user, mediaType());
		for (const list of userMedia) {
			for (const userStats of list.entries) {
				const mediaKey = userStats.media.id;
				const userKey = list.name + user.name;
				if (mediaKey in mediaInfo) {
					mediaInfo[mediaKey].userScores[userKey] = userStats.score
					mediaInfo[mediaKey].userRepeats[userKey] = userStats.repeat;
					continue;
				}
				if (userStats.media.format && userStats.media.format !== "TV" && userStats.media.format !== "ONA" && userStats.media.format !== "OVA") userStats.media.format = userStats.media.format.toLowerCase();
				userStats.media.season = userStats.media.season?.toLowerCase() || "";

				mediaInfo[mediaKey] = userStats.media;
				mediaInfo[mediaKey].userScores = { [userKey]: userStats.score };
				mediaInfo[mediaKey].userRepeats = { [userKey]: userStats.repeat };
			}
		}
	}
}