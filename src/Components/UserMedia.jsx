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
	const [count, setCount] = createSignal(0);

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
				const users = []
				const media = mediaInfo[mediaKey];

				for (const user of userTable()) {
					const userKey = "Completed" + user.name;
					if (userKey in media.userScores) {
						totalUserCount++;
						repeat += media.userRepeats[userKey];
						users.push({ name: user.name, avatar: user.avatar.medium, score: media.userScores[userKey], repeat: media.userRepeats[userKey] })

						if (media.userScores[userKey] > 0) {
							totalScore += media.userScores[userKey];
							totalUserWhoScored++;
						}
					}
				}

				const score = totalScore ? (totalScore / totalUserWhoScored).toFixed(2) : 0;

				array.push({
					info: media,
					english: media.title.english || media.title.userPreferred,
					native: media.title.native || media.title.userPreferred,
					romaji: media.title.romaji || media.title.userPreferred,
					coverImage: media.coverImage.large,
					color: media.coverImage.color,
					banner: media.bannerImage,
					episodes: media.episodes ||
						media.nextAiringEpisode?.episode ||
						media.chapters ||
						media.status,
					score,
					repeat,
					percentage: (totalUserCount / userTable().length),
					users: users.sort((a, b) => b.score - a.score)
				});
			});
		}

		array.sort((a, b) => b.score - a.score || a.english.localeCompare(b.english));

		setMediaData(array);
		array = [];
		checkedArray = {};
	});

	createEffect(() => {
		mediaData();
		percentage();
		setCount(document.querySelector(`main.${style.flex}`).children.length);
	});


	return (
		<>
			<p>Matches: {count()}</p>
			<main className={style.flex}>
				<For each={mediaData()}>{media => (
					<Show when={media.percentage >= percentage()}>
						<div className={style.media}>
							{media.banner ? <img className={style.banner} loading="lazy" src={media.banner} /> : <div className={style.banner} style={"background-color: " + media.color}></div>}
							<div className={style.coverContainer}>
								<img className={style.cover} loading="lazy" src={media.coverImage} />
								{media.repeat && (<p className={style.repeat}>{media.repeat}<RepeatSvg /></p>)}
								<p className={style.episodes}>{media.episodes}</p>
								<p className={style.score}>{media.score}</p>
							</div>

							<div className={style.rightContainer}>
								<p className={style.title}>{media.english}</p>
								<div className={style.users}>
									<For each={media.users}>{user => (
										<div className={style.row}>
											<img className={style.avatar} src={user.avatar} />
											<span className={style.name}>{user.name}</span>
											{user.repeat && (<span className={style.repeat}>{user.repeat}<RepeatSvg /></span>)}
											<span className={style.score}>{user.score.toFixed(1)}</span>
										</div>
									)}</For>
								</div>
								<div className={style.info}>
									<span class="capitalize" className={style.format}>{media.info.format}</span>
									<Show when={media.info.startDate.year} fallback={<span className={style.date}>TBA</span>}>
										<span class="capitalize" className={style.date}>{`${media.info.season} ${media.info.startDate.year}`}</span>
									</Show>
								</div>
							</div>
						</div>
					</Show>
				)}</For>
			</main>
		</>
	)
}

function RepeatSvg() {
	return <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H464c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z" /></svg>
}

export default UserMedia;