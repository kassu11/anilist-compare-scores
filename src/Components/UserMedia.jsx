let array = [];
let checkedArray = {};

import { createEffect, createSignal } from "solid-js";
import { userTable } from "./UserTable";
import { fetchUserMedia } from "../api/anilist";
import { percentage } from "./UserSearch";
import { mediaType } from "./MediaTypeButtons";
import { updateMediaInfoObject } from "../utilities/updateMediaInfoObject";

import style from "./UserMedia.module.css";

export const mediaInfo = {};

function UserMedia() {
	const [mediaData, setMediaData] = createSignal([])

	createEffect(async () => {
		console.log("BIG update to media info");
		await updateMediaInfoObject();

		for (const user of userTable()) {
			const userMedia = await fetchUserMedia(user, mediaType());
			userMedia.find(list => list.name === "Completed")?.entries.forEach(entry => {
				const mediaKey = entry.media.id;
				if (checkedArray[mediaKey]) return;
				checkedArray[mediaKey] = true;

				let totalUserCount = 0;
				let totalUserWhoScored = 0;
				let totalScore = 0;
				let repeat = 0;

				for (const user of userTable()) {
					const userKey = "Completed" + user.name;
					if (userKey in mediaInfo[mediaKey].userScores) {
						totalUserCount++;
						repeat += mediaInfo[mediaKey].userRepeats[userKey];

						if (mediaInfo[mediaKey].userScores[userKey] > 0) {
							totalScore += mediaInfo[mediaKey].userScores[userKey];
							totalUserWhoScored++;
						}
					}
				}

				const score = (totalScore / totalUserWhoScored).toFixed(2);

				array.push({
					english: entry.media.title.english || entry.media.title.userPreferred,
					native: entry.media.title.native || entry.media.title.userPreferred,
					romaji: entry.media.title.romaji || entry.media.title.userPreferred,
					coverImage: entry.media.coverImage.large,
					color: entry.media.coverImage.color,
					banner: entry.media.bannerImage,
					episodes: entry.media.episodes ||
						entry.media.nextAiringEpisode?.episode ||
						entry.media.chapters ||
						entry.media.status,
					score,
					repeat,
					percentage: (totalUserCount / userTable().length),
				});
			});
		}

		array.sort((a, b) => b.score - a.score || a.english.localeCompare(b.english));

		setMediaData(array);
		array = [];
		checkedArray = {};
	});


	return (
		<main className={style.flex}>
			<For each={mediaData()}>{media => (
				<Show when={media.percentage >= percentage()}>
					<div className={style.media}>
						{media.banner ? <img className={style.banner} loading="lazy" src={media.banner} /> : <div className={style.banner} style={"background-color: " + media.color}></div>}
						<div className={style.coverContainer}>
							<img className={style.cover} loading="lazy" src={media.coverImage} />
							{media.repeat ? <p className={style.repeat}>{media.repeat}<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H464c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z" /></svg></p> : null}
							<p className={style.episodes}>{media.episodes}</p>
							<p className={style.score}>{media.score}</p>
						</div>

						<p className={style.title}>{media.english}</p>
					</div>
				</Show>
			)}</For>
		</main>
	)
}

export default UserMedia;