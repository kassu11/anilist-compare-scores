import { createEffect, createSignal } from "solid-js";
import { fetchUserMedia } from "../api/anilist";
import { percentage, sortValue, listType, mediaType, userTable, mediaLoading, setMediaLoading } from "../utilities/signals";
import { updateMediaInfoObject } from "../utilities/updateMediaInfoObject";
import LoadingMediaElem from "./LoadingMediaElem";

import "../style/mediaCards.scss";

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
		setCount(mediaCards?.childElementCount - 1);
	});

	return (
		<>
			<p>Matches: {count()}</p>
			<main id="mediaCards" class="media-card-container" classList={{ ["media-is-loading"]: mediaLoading() }}>
				<LoadingMediaElem />
				<MediaCardGroup start={0} />
			</main>
		</>
	);
}

const groupSize = 50;
function MediaCardGroup({ start }) {
	const [buffer, setBuffer] = createSignal(false);
	setTimeout(() => {
		setBuffer(true);
		if (start in mediaData()) return;
		setCount(mediaCards?.childElementCount - 1 || 0);
	});

	const end = start + groupSize;

	return (
		<Show when={buffer()}>
			<For each={mediaData()?.slice(start, end)}>{(media) => <MediaCard media={media} />}</For>
			{mediaData()[start] && <MediaCardGroup start={end} />}
		</Show>
	);
}

function MediaCard({ media }) {
	return (
		<Show when={media.percentage >= percentage()}>
			<div class="media-card">
				<Show when={media.banner} fallback={<div class="card-banner" style={"background-color: " + media.color}></div>}>
					<img class="card-banner" loading="lazy" src={media.banner} />
				</Show>
				<div class="cover-container">
					<img class="media-cover-image" loading="lazy" src={media.coverImage} />
					<Repeat repeat={media.repeat} />
					<span class="episodes">{media.episodes}</span>
					<span class="score">{media.score}</span>
				</div>

				<UserScoreList media={media} />
			</div>
		</Show>
	);
}

function UserScoreList({ media }) {
	return (
		<div class="media-right-container">
			<p class="media-title">{media.english}</p>
			<div class="user-score-container">
				<For each={media.users}>
					{(user, i) => (
						<>
							<Show when={user.list != media.users[i() - 1]?.list}>
								<span class="list-name">{userListOrder[user.list]}</span>
							</Show>
							<div class="media-user">
								<img class="profile-picture" src={user.avatar} />
								<span class="name">{user.name}</span>
								<Repeat repeat={user.repeat} />
								<span class="score">{user.score.toFixed(1)}</span>
							</div>
						</>
					)}
				</For>
			</div>
			<div class="media-info">
				<span class="capitalize format">{media.info.format}</span>
				<Show when={media.info.startDate.year} fallback={<span>TBA</span>}>
					<span class="capitalize">{`${media.info.season} ${media.info.startDate.year}`}</span>
				</Show>
			</div>
		</div>
	);
}

function Repeat({ repeat }) {
	return (
		<Show when={repeat}>
			<div class="media-repeat-container">
				<span>{repeat}</span>
				<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
					<path d="M386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H464c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z" />
				</svg>
			</div>
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

	if (filteredLists[filterKey + sortType]) {
		setMediaLoading(false);
		return setMediaData(filteredLists[filterKey + sortType]);
	}
	if (filteredLists[filterKey]) {
		const listData = sortArray(filteredLists[filterKey], sortType, true);
		filteredLists[filterKey + sortType] = listData;
		setMediaLoading(false);
		return setMediaData(listData);
	}

	if (exclude) worker = ExcludeWorker instanceof Worker ? ExcludeWorker : new ExcludeWorker();
	else worker = IncludeWorker instanceof Worker ? IncludeWorker : new IncludeWorker();

	worker.postMessage([usersArray, listTypes, sortType, userMediaData, mediaInfo]);
	worker.onmessage = (e) => {
		filteredLists[filterKey] = e.data;
		filteredLists[filterKey + sortType] = e.data;
		setMediaLoading(false);
		setMediaData(e.data);
	};
}

function sortArray(array, type = "score", clone = false) {
	const sorts = {
		score: (a, b) => b.score - a.score || a.english.localeCompare(b.english),
		repeat: (a, b) => b.repeat - a.repeat || b.score - a.score || a.english.localeCompare(b.english),
		title: (a, b) => a.english.localeCompare(b.english),
	};

	if (clone) return array.toSorted(sorts[type]);
	return array.sort(sorts[type]);
}

export default UserMediaList;

// setInterval(() => {
// 	setMediaLoading(true);
// }, 2000);
