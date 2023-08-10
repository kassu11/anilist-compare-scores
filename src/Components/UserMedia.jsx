let array = [];
let checkedArray = {};
import { createEffect, createSignal } from "solid-js";
import { userTable } from "./UserTable";
import { fetchedUserMedias } from "../api/anilist"

import style from "./UserMedia.module.css"

export const mediaInfo = {};

function UserMedia() {
	const [mediaData, setMediaData] = createSignal([])

	createEffect(() => {
		for (const user of userTable()) {
			const userMedia = fetchedUserMedias[user.name]
			userMedia.MediaListCollection.lists.find(list => list.name === "Completed").entries.forEach(entry => {
				if (checkedArray[entry.media.id]) return;
				console.log(mediaInfo[entry.media.id])
				checkedArray[entry.media.id] = true;
				const score = avarageScore(mediaInfo[entry.media.id].users);
				if (!score) return;
				array.push({
					english: entry.media.title.english,
					native: entry.media.title.native,
					romaji: entry.media.title.romaji,
					coverImage: entry.media.coverImage.large,
					color: entry.media.coverImage.color,
					banner: entry.media.bannerImage,
					episodes: entry.media.episodes || entry.media.nextAiringEpisode.episode || entry.media.status,
					score,
				});
			});
		}

		setMediaData(array);
		array = [];
		checkedArray = {};
	});

	function avarageScore(scores) {
		let sum = 0;
		let userCount = 0;
		for (const user of userTable()) {
			if (scores[user.name] > 0) {
				sum += scores[user.name];
				userCount++;
			}
		}

		if (userCount / userTable().length < 1) return null;
		return (sum / userCount).toFixed(2);
	}


	return (
		<main className={style.flex}>
			<For each={mediaData()}>{media => (
				<div className={style.media}>
					{media.banner ? <img className={style.banner} loading="lazy" src={media.banner} /> : <div className={style.banner} style={"background-color: " + media.color}></div>}
					<div className={style.coverContainer}>
						<img className={style.cover} loading="lazy" src={media.coverImage} />
						<p>{media.episodes}</p>
						<p>{media.score}</p>
					</div>

					<p>{media.english}</p>
				</div>
			)}</For>
		</main>
	)
}

export default UserMedia;