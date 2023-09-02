import { fetchUsers } from "../../api/anilist";
import { createSignal, createResource } from "solid-js";
import { userTable, setUserTable, searchIndex, setSearchIndex } from "../../utilities/signals";
import { updateMediaInfoObject } from "../../utilities/updateMediaInfoObject";
import { updateMediaData } from "../UserMedia";

import UserSearchItem from "./UserSearchItem";
import UserSearchLoading from "./UserSearchLoading";
import SearchError from "./SearchError";

import searchStyle from "./UserSearch2.module.css";
import userItemStyle from "./UserSearchItem.module.css";

const [search, setSearch] = createSignal();
const [error, setError] = createSignal();

function UserSearch() {
	const [recommendations] = createResource(search, fetchUsers);

	return (
		<>
			<p onClick={openDialog} className={searchStyle.search}>
				<i class="fa-solid fa-magnifying-glass"></i> Search users
			</p>

			<dialog id="userSearch" className={searchStyle.userSearch} onFocus={closeOnFocus}>
				<div id="wrapper">
					<form onSubmit={submitSearch} onInput={({ target }) => setSearch(target.value)}>
						<i class="fa-solid fa-magnifying-glass"></i>
						<input
							className={searchStyle.userInput}
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
						<div className={searchStyle.userList} tabIndex="0">
							<For each={recommendations()}>{(user, index) => <UserSearchItem user={user} index={index()} selected={index() === 0} />}</For>
						</div>
					</Show>
				</div>

				<SearchError error={error} />
			</dialog>
		</>
	);

	function closeOnFocus(event) {
		if (event.target.tagName === "DIALOG") event.target.close();
	}
}

function keyboard(event) {
	const { code } = event;

	if ((code === "Enter" && document.querySelector("#userSearch input").value === "") || code === "Escape") {
		document.querySelector("#userSearch").close();
		setSearch("");
		setError("");
		return;
	} else if (code === "ArrowUp" || (code === "Tab" && event.shiftKey)) {
		event.preventDefault();
		const user = document.querySelector(`.${userItemStyle.user}[custom-selected]`);
		if (!user) return;
		user.removeAttribute("custom-selected");
		const elem = user.previousElementSibling || user;
		elem?.setAttribute("custom-selected", "");
		elem?.scrollIntoView({ block: "nearest" });
	} else if (code === "ArrowDown" || code === "Tab") {
		event.preventDefault();
		const user = document.querySelector(`.${userItemStyle.user}[custom-selected]`);
		if (!user) return;
		user.removeAttribute("custom-selected");
		const elem = user.nextElementSibling || user;
		elem?.setAttribute("custom-selected", "");
		elem?.scrollIntoView({ block: "nearest" });
	}

	const selected = document.querySelector(`.${userItemStyle.user}[custom-selected]`);
	if (selected) {
		const index = Array.from(selected.parentElement.children).indexOf(selected);
		setSearchIndex(index);
	}
}

function openDialog() {
	const dialog = document.getElementById("userSearch");
	dialog.querySelector("input").select();
	dialog.showModal();
}

export async function submitSearch(event) {
	event?.preventDefault?.();
	const input = document.querySelector("#userSearch input");
	const userName = input.value;
	input.value = "";
	setSearch("");
	if (!userName) return console.log("No input");

	const newUser = (await fetchUsers(userName))[searchIndex()];

	if (!newUser?.name) {
		setError(`User "${userName}" not found`);
		return console.log("No users found");
	}
	if (userTable().some((user) => user.id === newUser.id)) return console.log("User already added");

	await updateMediaInfoObject(newUser);
	newUser.enabled = true;
	newUser.exclude = false;

	const users = [...userTable(), newUser];
	setUserTable(users);
	updateMediaData();
	setSearchIndex(0);
}

export default UserSearch;
