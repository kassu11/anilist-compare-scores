import { createEffect, createSignal } from "solid-js";
import { fetchUserMedia } from "../api/anilist";
import { percentage, sortValue, listType, mediaType, userTable, mediaLoading, setMediaLoading } from "../utilities/signals";
import { updateMediaInfoObject } from "../utilities/updateMediaInfoObject";
import LoadingMediaElem from "./LoadingMediaElem";

import "../style/mediaCards.scss";

import IncludeWorker from "../workers/includeUpdate.js?worker";
import ExcludeWorker from "../workers/excludeUpdate.js?worker";

export const mediaInfo = {};
const filteredLists = {};
const [mediaData, setMediaData] = createSignal([]);
let observer;

const [count, setCount] = createSignal(0);
function UserMediaList() {
	createEffect(() => {
		mediaData();
		percentage();
		setCount(mediaCards?.childElementCount - 1);
	});

	const mediaContainer = (
		<main id="mediaCards" class="media-card-container" classList={{ ["media-is-loading"]: mediaLoading() }}>
			<LoadingMediaElem />
			<MediaCardGroup start={0} />
		</main>
	);

	const options = {
		rootMargin: "500px",
		threshold: 1.0,
	};

	observer = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const coverContainer = entry.target.querySelector(".cover-container");
				const mediaId = parseInt(entry.target.getAttribute("custom-media-id"));
				if (mediaId in mediaCoverImages) coverContainer.append(mediaCoverImages[mediaId]);
				if (mediaId in mediaBannerImages) {
					coverContainer.querySelector("div.card-banner")?.remove();
					coverContainer.before(mediaBannerImages[mediaId]);
				}

				observer.unobserve(entry.target);
			}
		});
	}, options);

	return (
		<>
			<p>Matches: {count()}</p>
			{mediaContainer}
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

const mediaCoverImages = {};
const mediaBannerImages = {};

function MediaCard({ media }) {
	const bannerImage = <img class="card-banner" src={media.banner} style={"background-color: " + media.color} />;
	const coverImage = <img class="media-cover-image" src={media.coverImage} />;
	mediaCoverImages[media.info.id] ??= coverImage;
	if (media.banner) mediaBannerImages[media.info.id] ??= bannerImage;

	const mediaCard = (
		<div class="media-card" attr:custom-media-id={media.info.id}>
			<Show when={!media.banner}>
				<div class="card-banner" style={"background-color: " + media.color}></div>
			</Show>
			<div class="cover-container">
				<Repeat repeat={media.repeat} />
				<span class="episodes">{media.episodes}</span>
				<span class="score">{media.score}</span>
			</div>

			<UserScoreList media={media} />
		</div>
	);

	observer.observe(mediaCard);

	return <Show when={media.percentage >= percentage()}>{mediaCard}</Show>;
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
								<span class="list-name">{user.list}</span>
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
				<span class="format">{media.info.format}</span>
				<Show when={media.info.startDate.year} fallback={<span>TBA</span>}>
					<span>{`${media.info.season} ${media.info.startDate.year}`}</span>
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

	worker.postMessage([usersArray, listTypes, sortType, userMediaData]);
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
		averageScore: (a, b) => b.info.averageScore - a.info.averageScore || a.english.localeCompare(b.english),
	};

	if (clone) return array.toSorted(sorts[type]);
	return array.sort(sorts[type]);
}

export default UserMediaList;

// setInterval(() => {
// 	setMediaLoading(true);
// }, 2000);
