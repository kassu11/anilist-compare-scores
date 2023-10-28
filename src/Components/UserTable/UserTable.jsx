import { createResource } from "solid-js";
import { mediaType } from "../../utilities/signals";
import { fetchUserMedia } from "../../api/anilist";
import { updateMediaData } from "../UserMedia";
import TrashCanSvg from "../Icons/TrashCan";
import UserSearch from "../UserSearch/UserSearch";
import { userTable, setUserTable } from "../../utilities/signals";
import IncludeUsersOption from "./UserIncludeBar";
import { SelectionList, updateAllUserLists } from "../ListNames";

import "../../style/settings.scss";

function UserTable() {
	return (
		<div class="userContainer">
			<div class="options">
				<UserSearch />
				<IncludeUsersOption />
			</div>
			<div id="userGrid">
				<Show when={userTable()?.length}>
					<Header />
					<For each={userTable()}>{(user) => <UserRow user={user} />}</For>
				</Show>
			</div>
		</div>
	);
}

function Header() {
	return (
		<div className="subgrid-row user-header-row">
			<span>Selection</span>
			<span>Name</span>
			<span>Anime</span>
			<span>Score</span>
			<span style="margin-right: 10px">Hours</span>
			<span>Manga</span>
			<span>Score</span>
			<span style="margin-right: 10px">Chapters</span>
			<span>Advanced</span>
			<span>Exclude</span>
		</div>
	);
}

function UserRow({ user }) {
	return (
		<div className="subgrid-row user-row">
			<div class="selection-options">
				<label class="hitbox">
					<input type="checkbox" for="enabled" checked onChange={(e) => inputTest(e, user)} onClick={multiSelect} />
				</label>
				<div class="hamburger"></div>
				<RemoveUser user={user} />
			</div>
			<div class="user-name">
				<img src={user.avatar.medium} alt={user.name} class="profile" height="25" />
				<span>{user.name}</span>
			</div>
			<span class="right">{user.statistics.anime.count}</span>
			<span class="center">{user.statistics.anime.meanScore}</span>
			<span>{Math.round(user.statistics.anime.minutesWatched / 60)}</span>
			<span class="right">{user.statistics.manga.count}</span>
			<span class="center">{user.statistics.manga.meanScore}</span>
			<span>{Math.round(user.statistics.manga.chaptersRead)}</span>
			<label>
				<input type="checkbox" for="advanced" onChange={(e) => inputTest(e, user)} onClick={multiSelect} /> Advanced
			</label>
			<div class="exclude">
				<label class="hitbox">
					<input type="checkbox" for="exclude" onChange={(e) => inputTest(e, user)} onClick={multiSelect} />
				</label>
			</div>
			<UserInfo user={user} />
		</div>
	);
}

const custom = (list) => list.isCustomList;
const list = (userData) => {
	const allLists = userData().map((v) => v.name);
	if (userData().some(custom)) allLists.push("Custom");
	return allLists.sort();
};

function UserInfo({ user }) {
	const [value] = createResource(mediaType, (type) => fetchUserMedia(user, type));

	return (
		<div class="user-advanced-info">
			<Show when={value()}>
				<form>
					<SelectionList values={() => list(value)} scope={user.id + "-"} />
				</form>
			</Show>
		</div>
	);
}

function RemoveUser({ user }) {
	return (
		<div
			class="trash"
			onClick={() => {
				setUserTable((users) => users.filter((u) => u.id !== user.id));
				updateAllUserLists();
				updateMediaData();
			}}
		>
			<TrashCanSvg />
		</div>
	);
}

async function inputTest(event, user) {
	const forType = event.target.getAttribute("for");
	const userRow = event.target.closest(".user-row");

	if (forType === "enabled") {
		user.enabled = event.target.checked;
		userRow.classList.toggle("disabled", !event.target.checked);
	} else if (forType === "exclude") {
		user.exclude = event.target.checked;
		userRow.classList.toggle("excludeRow", event.target.checked);
	} else if (forType === "advanced") {
		userRow.classList.toggle("open-advanced-info", event.target.checked);
	}

	setUserTable((users) => [...users]);
	await updateAllUserLists();
}

async function multiSelect(event) {
	const input = event.target.tagName === "INPUT" ? event.target : event.target.querySelector("input");
	const forType = input.getAttribute("for");
	if (!event.shiftKey) return;

	const checkboxes = userGrid.querySelectorAll(`input[for="${forType}"]`);
	let sum = 0;
	for (const checkbox of checkboxes) {
		if (checkbox.checked) sum++;
	}

	if (sum === checkboxes.length || (sum === checkboxes.length - 1 && !input.checked)) {
		checkboxes.forEach((input) => (input.checked = false));
		input.checked = true;
	} else {
		checkboxes.forEach((input) => (input.checked = true));
		input.checked = false;
	}

	if (forType === "advanced") {
		checkboxes.forEach((input) => input.closest(".user-row").classList.toggle("open-advanced-info", input.checked));
		return;
	}

	setUserTable((users) =>
		users.map((user, index) => {
			user[forType] = checkboxes[index].checked;
			if (forType === "enabled") checkboxes[index].closest(".user-row").classList.toggle("disabled", !checkboxes[index].checked);
			else if (forType === "exclude") checkboxes[index].closest(".user-row").classList.toggle("excludeRow", checkboxes[index].checked);
			return user;
		})
	);
}

export default UserTable;
