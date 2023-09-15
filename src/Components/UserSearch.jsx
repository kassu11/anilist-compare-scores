import { fetchUsers } from "../api/anilist";
import { createSignal, createResource } from "solid-js";
import { userTable, setUserTable, setPercentage, setSortValue } from "../utilities/signals";
import { setWithBuffer } from "../utilities/buffer.js";
import { updateMediaInfoObject } from "../utilities/updateMediaInfoObject";
import { updateMediaData } from "./UserMedia";

import "../style/settings.scss";

const [search, setSearch] = createSignal();

let searchIndex = 0;

function UserSearch() {
	const [recommendations] = createResource(search, fetchUsers);

	return (
		<nav>
			<form onSubmit={(e) => e.preventDefault()}>
				<ul>
					<li>
						<button type="button" onClick={openDialog}>
							<i class="fa-solid fa-magnifying-glass"></i> User Search
						</button>
					</li>
					<li>
						<input value="100" onInput={(e) => calcPercentage(e.target.value)} />
					</li>
					<li>
						<input type="checkbox" name="zero" id="hideZero" />
						<label htmlFor="hideZero">Hide zero</label>
					</li>
					<li>
						<label for="sort">Sorting order </label>
						<select id="sort" onInput={sortSelect}>
							<option value="score">Score</option>
							<option value="repeat">Repeat</option>
							<option value="title">Title</option>
						</select>
					</li>
				</ul>
			</form>

			<dialog id="userSearch" class="userSearch" onFocus={closeOnFocus}>
				<div id="wrapper">
					<form onSubmit={submitSearch} onInput={({ target }) => setSearch(target.value)}>
						<i class="fa-solid fa-magnifying-glass"></i>
						<input
							class="userInput"
							onKeyDown={keyboard}
							type="search"
							autocomplete="off"
							autocapitalize="off"
							autocorrect="off"
							spellcheck="false"
							placeholder="Type to search"
						></input>
					</form>
					<Show when={!recommendations.loading} fallback={UserSearchLoading}>
						<div class="userList" tabIndex="0">
							<For each={recommendations()}>{(user, index) => <UserSearchItem user={user} index={index()} selected={index() === 0} />}</For>
						</div>
					</Show>
				</div>
			</dialog>
		</nav>
	);
}

function UserSearchItem({ user, selected, index }) {
	return (
		<div
			attr:custom-selected={selected}
			class="user"
			onClick={() => {
				searchIndex = index;
				submitSearch();
				document.querySelector("#userSearch input").focus();
			}}
			onMouseMove={(e) => {
				if (e.target.getAttribute("custom-selected") === "true") return;
				const users = document.querySelectorAll(`.$"user"[custom-selected="true"]`);
				users.forEach((user) => user.setAttribute("custom-selected", false));
				e.target.setAttribute("custom-selected", true);
			}}
		>
			<img src={user.avatar.medium} class="loading" onLoad={removeLoading} alt={user.name} height="25" />
			<span>{user.name}</span>
		</div>
	);
}

function removeLoading(e) {
	e.target.classList.remove("loading");
}
function UserSearchLoading() {
	const leading = new Array(5).fill(0);
	return (
		<For each={leading}>
			{() => (
				<div class="user">
					<div class="loadingImage"></div>
					<span class="loadingName">Loading...</span>
				</div>
			)}
		</For>
	);
}

function closeOnFocus(e) {
	if (e.target.tagName === "DIALOG") e.target.close();
}

function keyboard(e) {
	if (e.code === "Enter" && document.querySelector("#userSearch input").value === "") {
		document.querySelector("#userSearch").close();
		setSearch("");
		return;
	} else if (e.code === "Escape") {
		document.querySelector("#userSearch").close();
		setSearch("");
	} else if (e.code === "ArrowUp" || (e.code === "Tab" && e.shiftKey)) {
		e.preventDefault();
		const user = document.querySelector(`.$"user"[custom-selected="true"]`);
		if (!user) return;
		user.setAttribute("custom-selected", false);
		const elem = user.previousElementSibling || user;
		elem?.setAttribute("custom-selected", true);
		elem?.scrollIntoView({ block: "nearest" });
	} else if (e.code === "ArrowDown" || e.code === "Tab") {
		e.preventDefault();
		const user = document.querySelector(`.$"user"[custom-selected="true"]`);
		if (!user) return;
		user.setAttribute("custom-selected", false);
		const elem = user.nextElementSibling || user;
		elem?.setAttribute("custom-selected", true);
		elem?.scrollIntoView({ block: "nearest" });
	}

	const selected = document.querySelector(`.$"user"[custom-selected="true"]`);
	if (selected) {
		const index = Array.from(selected.parentElement.children).indexOf(selected);
		searchIndex = index;
	}
}

function sortSelect(e) {
	setSortValue(e.target.value);
	updateMediaData();
}

function calcPercentage(string_value) {
	const value = parseInt(string_value) / 100 || 0;
	const percentage = 1 / (userTable().filter((u) => u.enabled && !u.exclude).length || 1);
	const ceilToClosestDiff = Math.ceil(value / percentage) * percentage;
	const fixTo2Ceil = Math.floor(ceilToClosestDiff * 100) / 100;
	setWithBuffer(setPercentage, fixTo2Ceil);
}

function openDialog() {
	const dialog = document.getElementById("userSearch");
	dialog.querySelector("input").select();
	dialog.showModal();
}

async function submitSearch(event) {
	event?.preventDefault?.();
	const input = document.querySelector("#userSearch input");
	const userName = input.value;
	input.value = "";
	setSearch("");
	if (!userName) return console.log("No input");

	const newUser = (await fetchUsers(userName))[searchIndex];

	if (!newUser?.name) return console.log("No users found");
	if (userTable().some((user) => user.id === newUser.id)) return console.log("User already added");

	await updateMediaInfoObject(newUser);
	newUser.enabled = true;
	newUser.exclude = false;

	const users = [...userTable(), newUser];
	setUserTable(users);
	updateMediaData();
	searchIndex = 0;
}

export default UserSearch;
