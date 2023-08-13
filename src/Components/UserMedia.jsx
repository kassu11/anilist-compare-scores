let array = [];
let checkedArray = {};

import { createEffect, createSignal } from "solid-js";
import { userTable } from "./UserTable";
import { fetchUserMedia } from "../api/anilist";
import { percentage } from "./UserSearch";
import { mediaType } from "./MediaTypeButtons";
import { updateMediaInfoObject } from "../utilities/updateMediaInfoObject";
import { listType } from "./ListTypes";

import style from "./UserMedia.module.css";

const userLisrOrder = {
	"Completed": 1,
	"Watching": 2,
	"Rewatched": 3,
	"Paused": 4,
	"Dropped": 5,
	"Planning": 6,
	"Custom": 7,
	1: "Completed",
	2: "Watching",
	3: "Rewatched",
	4: "Paused",
	5: "Dropped",
	6: "Planning",
	7: "Custom",
}

export const mediaInfo = {};
const [mediaData, setMediaData] = createSignal([])

function UserMedia() {
	const [count, setCount] = createSignal(0);

	createEffect(async () => {
		listType(); // Update listType

		updateMediaData();
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
									<For each={media.users}>{(user, i) => (
										<>
											<Show when={user.list != media.users[i() - 1]?.list}>
												<div className={style.list}>
													<span>{userLisrOrder[user.list]}</span>
												</div>
											</Show>
											<div className={style.row}>
												<img className={style.avatar} src={user.avatar} />
												<span className={style.name}>{user.name}</span>
												{user.repeat && (<span className={style.repeat}>{user.repeat}<RepeatSvg /></span>)}
												<span className={style.score}>{user.score.toFixed(1)}</span>
											</div>
										</>
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

async function updateMediaData() {
	await updateMediaInfoObject();
	for (const user of userTable()) {
		const userMedia = await fetchUserMedia(user, mediaType());
		console.log(userMedia);
		for (const type of listType()) {
			for (const list of userMedia) {
				const listKey = list.isCustomList ? "Custom" : list.name;
				if (listKey === type) list.entries.forEach(entry => {
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
						const userKey = user.name;
						const isOnSelectedList = listType().find(type => media.userLists[userKey]?.[type]);
						if (!isOnSelectedList) continue;

						totalUserCount++;
						repeat += media.userRepeats[userKey];
						users.push({
							name: user.name,
							avatar: user.avatar.medium,
							score: media.userScores[userKey],
							repeat: media.userRepeats[userKey],
							list: userLisrOrder[isOnSelectedList]
						})

						if (media.userScores[userKey] > 0) {
							totalScore += media.userScores[userKey];
							totalUserWhoScored++;
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
							media.chapters || "TBA",
						score,
						repeat,
						percentage: (totalUserCount / userTable().length),
						users: users.sort((a, b) => {
							return (a.list - b.list) || b.score - a.score;
						})
					});
				});
			}
		}
	}

	array.sort((a, b) => b.score - a.score || a.english.localeCompare(b.english));

	setMediaData(array);
	array = [];
	checkedArray = {};
}

function RepeatSvg() {
	return <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H464c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z" /></svg>
}

export default UserMedia;