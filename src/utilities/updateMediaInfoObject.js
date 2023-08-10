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
				if (userStats.media.id in mediaInfo) {
					mediaInfo[userStats.media.id].userScores[user.name] = userStats.score
					mediaInfo[userStats.media.id].userRepeats[user.name] = userStats.repeat;
					continue;
				}
				mediaInfo[userStats.media.id] = userStats.media;
				mediaInfo[userStats.media.id].userScores = { [user.name]: userStats.score };
				mediaInfo[userStats.media.id].userRepeats = { [user.name]: userStats.repeat };
			}
		}
	}
}