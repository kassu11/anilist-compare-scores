let array = [];
let checkedArray = {};

import { createEffect, createSignal } from "solid-js";
import { userTable } from "./UserTable";
import { fetchedUserMedias } from "../api/anilist";
import { navSettings, percentage } from "./UserSearch";

import style from "./UserMedia.module.css";

export const mediaInfo = {};

function UserMedia() {
	const [mediaData, setMediaData] = createSignal([])

	createEffect(() => {
		for (const user of userTable()) {
			const userMedia = fetchedUserMedias[user.name]
			userMedia.MediaListCollection.lists.find(list => list.name === "Completed").entries.forEach(entry => {
				if (checkedArray[entry.media.id]) return;

				checkedArray[entry.media.id] = true;
				const score = avarageScore(mediaInfo[entry.media.id].userScores);
				const repeat = totalRepeats(mediaInfo[entry.media.id].userRepeats);

				if (!score) return;
				array.push({
					english: entry.media.title.english || entry.media.title.userPreferred,
					native: entry.media.title.native || entry.media.title.userPreferred,
					romaji: entry.media.title.romaji || entry.media.title.userPreferred,
					coverImage: entry.media.coverImage.large,
					color: entry.media.coverImage.color,
					banner: entry.media.bannerImage,
					episodes: entry.media.episodes || entry.media.nextAiringEpisode?.episode || entry.media.status,
					score,
					repeat,
				});
			});
		}

		array.sort((a, b) => b.score - a.score || a.english.localeCompare(b.english));

		setMediaData(array);
		array = [];
		checkedArray = {};
	});

	function avarageScore(scores) {
		let sum = 0;
		let userCount = 0;
		for (const user of userTable()) {
			if (user.name in scores) {
				sum += scores[user.name];
				userCount++;
			}
		}

		if (userCount / userTable().length < percentage()) return null;
		return (sum / userCount).toFixed(2);
	}

	function totalRepeats(repeats) {
		let sum = 0;
		for (const user of userTable()) {
			sum += repeats[user.name] || 0;
		}

		return sum;
	}


	return (
		<main className={style.flex}>
			<For each={mediaData()}>{media => (
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
			)}</For>
		</main>
	)
}

export default UserMedia;