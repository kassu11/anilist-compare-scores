import { userTable } from "../utilities/signals";
import { mediaInfo } from "../Components/UserMedia";
import { mediaType, setMediaLoading } from "../utilities/signals";
import { fetchUserMedia } from "../api/anilist";

const userDataSaved = {};

export async function updateMediaInfoObject(...newUsers) {
	const users = [...userTable(), ...newUsers];
	const mediaTypeValue = mediaType();

	for (const user of users) {
		const key = user.name + mediaTypeValue;
		const userName = user.name;
		if (userDataSaved[key]) continue;
		setMediaLoading(true);
		userDataSaved[key] = true;

		const userAnimeLists = await fetchUserMedia(user, mediaTypeValue);
		const rewatchedName = mediaTypeValue === "MANGA" ? "Reread" : "Rewatched";
		const rewatchedList = { name: rewatchedName, renderName: rewatchedName, isCustomList: false, entries: [] };

		for (const animeList of userAnimeLists) {
			animeList.renderName = animeList.name;
			animeList.name = animeList.isCustomList ? "c-" + animeList.name : animeList.name;

			for (let i = 0; i < animeList.entries.length; i++) {
				const anime = animeList.entries[i];
				animeList.entries[i] = processEntry(anime, animeList.name, userName);
				if (animeList.isCustomList) processEntry(anime, "Custom", userName);
				if (anime.repeat) rewatchedList.entries.push(processEntry(anime, rewatchedName, userName));
			}
		}

		if (rewatchedList.entries.length) userAnimeLists.push(rewatchedList);

		console.log(userAnimeLists);
	}
}

function processEntry(entry, listName, userName) {
	newEntry: {
		if (entry.media.id in mediaInfo) break newEntry;
		mediaInfo[entry.media.id] = entry.media;

		entry.media.format = mediaFormat(entry.media.format);
		entry.media.season = mediaSeason(entry.media.season);
		entry.media.episodes ||= entry.media.nextAiringEpisode?.episode || entry.media.chapters || "TBA";

		entry.media.title.english ??= entry.media.title.userPreferred;
		entry.media.title.native ??= entry.media.title.userPreferred;
		entry.media.title.romaji ??= entry.media.title.userPreferred;

		entry.media.allLists = {};
		entry.media.userLists = {};
		entry.media.userScores = {};
		entry.media.userRepeats = {};
	}

	const anime = mediaInfo[entry.media.id];

	anime.userLists[userName] ??= {};
	anime.userLists[userName][listName] = true;
	anime.userScores[userName] = entry.score;
	anime.userRepeats[userName] = entry.repeat;

	return anime;
}

function mediaFormat(format) {
	if (format === "TV_SHORT") return "TV Short";
	if (format == "TV" || format == "ONA" || format == "OVA") return format;
	return capitalize(format);
}

function mediaSeason(season) {
	if (!season) return "";
	return capitalize(season);
}

function capitalize(string) {
	if (!string) return "";
	return string[0].toUpperCase() + string.substring(1).toLowerCase();
}
