import { createEffect, createSignal } from "solid-js";
import { fetchUserMedia } from "../api/anilist";
import { percentage, sortValue, listType, mediaType, userTable } from "../utilities/signals";
import { updateMediaInfoObject } from "../utilities/updateMediaInfoObject";

import style from "./UserMedia.module.css";

import IncludeWorker from "../workers/includeUpdate.js?worker";
import ExcludeWorker from "../workers/excludeUpdate.js?worker";

export const userListOrder = {
	Completed: 1,
	Watching: 2,
	Reading: 3,
	Rewatched: 4,
	Paused: 5,
	Dropped: 6,
	Planning: 7,
	Custom: 8,
	1: "Completed",
	2: "Watching",
	3: "Reading",
	4: "Rewatched",
	5: "Paused",
	6: "Dropped",
	7: "Planning",
	8: "Custom",
};

export const mediaInfo = {};
const filteredLists = {};
const [mediaData, setMediaData] = createSignal([]);

const [count, setCount] = createSignal(0);
function UserMediaList() {
	createEffect(() => {
		mediaData();
		percentage();
		setCount(document.querySelector("#mediaCards").childElementCount);
	});

	return (
		<>
			<p>Matches: {count()}</p>
			<main id="mediaCards" className={style.flex}>
				<MediaCardGroup data={mediaData} index={0} />
			</main>
		</>
	);
}

function MediaCardGroup({ data, index }) {
	const [loaded, setLoaded] = createSignal(false);
	setTimeout(() => {
		setLoaded(true);
		if (index in data()) return;

		setCount(document.querySelector("#mediaCards")?.childElementCount || 0);
	});

	return (
		<Show when={loaded()}>
			<For each={data()[index]}>{(media) => <MediaCard media={media} />}</For>
			{data()[index] && <MediaCardGroup data={data} index={index + 1} />}
		</Show>
	);
}

function MediaCard({ media }) {
	return (
		<Show when={media.percentage >= percentage()}>
			<div className={style.media}>
				<Show when={media.banner} fallback={<div className={style.banner} style={"background-color: " + media.color}></div>}>
					<img className={style.banner} loading="lazy" src={media.banner} />
				</Show>
				<div className={style.coverContainer}>
					<img className={style.cover} loading="lazy" src={media.coverImage} />
					<Repeat repeat={media.repeat} />
					<p className={style.episodes}>{media.episodes}</p>
					<p className={style.score}>{media.score}</p>
				</div>

				<UserScoreList media={media} />
			</div>
		</Show>
	);
}

function UserScoreList({ media }) {
	return (
		<div className={style.rightContainer}>
			<p className={style.title}>{media.english}</p>
			<div className={style.users}>
				<For each={media.users}>
					{(user, i) => (
						<>
							<Show when={user.list != media.users[i() - 1]?.list}>
								<span className={style.listName}>{userListOrder[user.list]}</span>
							</Show>
							<div className={style.row}>
								<img className={style.avatar} src={user.avatar} />
								<span className={style.name}>{user.name}</span>
								<Repeat repeat={user.repeat} />
								<span className={style.score}>{user.score.toFixed(1)}</span>
							</div>
						</>
					)}
				</For>
			</div>
			<div className={style.info}>
				<span class="capitalize" className={style.format}>
					{media.info.format}
				</span>
				<Show when={media.info.startDate.year} fallback={<span className={style.date}>TBA</span>}>
					<span class="capitalize" className={style.date}>{`${media.info.season} ${media.info.startDate.year}`}</span>
				</Show>
			</div>
		</div>
	);
}

function Repeat({ repeat }) {
	return (
		<Show when={repeat}>
			<p className={style.repeat}>
				{repeat}
				<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
					<path d="M386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H464c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z" />
				</svg>
			</p>
		</Show>
	);
}

let worker;
export async function updateMediaData() {
	if (worker instanceof Worker) worker.terminate();
	console.warn("Render Media Data");
	const usersArray = userTable()
		.sort()
		.filter((u) => u.enabled);

	const listTypes = listType(),
		type = mediaType(),
		sortType = sortValue();

	const filterKey = usersArray.map((u) => u.name + u.exclude).join("-") + listTypes.join("-") + type;
	const exclude = usersArray.some((u) => u.exclude);

	await updateMediaInfoObject();
	const userMediaData = [];
	for (const user of usersArray) userMediaData.push(await fetchUserMedia(user, type));

	if (filteredLists[filterKey + sortType]) return setMediaData(filteredLists[filterKey + sortType]);
	if (filteredLists[filterKey]) {
		const listData = sortArray(filteredLists[filterKey], sortType, true);
		filteredLists[filterKey + sortType] = listData;
		return setMediaData(listData);
	}

	if (exclude) worker = ExcludeWorker instanceof Worker ? ExcludeWorker : new ExcludeWorker();
	else worker = IncludeWorker instanceof Worker ? IncludeWorker : new IncludeWorker();

	worker.postMessage([usersArray, listTypes, sortType, userMediaData, mediaInfo]);
	worker.onmessage = (e) => {
		filteredLists[filterKey] = e.data;
		filteredLists[filterKey + sortType] = e.data;
		setMediaData(e.data);
	};
}

export default UserMediaList;
