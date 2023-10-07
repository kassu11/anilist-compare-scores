import { fetchUsers } from "../../api/anilist";
import { createSignal, createResource } from "solid-js";
import { userTable, setUserTable, searchIndex, setSearchIndex } from "../../utilities/signals";
import { updateMediaInfoObject } from "../../utilities/updateMediaInfoObject";
import { updateMediaData } from "../UserMedia";
import { updateListType, updateAllUserLists } from "../ListNames";

import UserSearchItem from "./UserSearchItem";
import UserSearchLoading from "./UserSearchLoading";
import SearchError from "./SearchError";
import MagnifyingGlassSvg from "../Icons/MagnifyingGlassSvg";

import "../../style/settings.scss";
import "../../style/userSearchDialog.scss";

const [search, setSearch] = createSignal();
const [error, setError] = createSignal();

function UserSearch() {
	const [recommendations] = createResource(search, fetchUsers);

	return (
		<>
			<p onClick={openDialog} class="search">
				<MagnifyingGlassSvg /> Search users
			</p>

			<dialog id="userSearchDialog" onFocus={closeOnFocus}>
				<form onSubmit={submitSearch} onInput={({ target }) => setSearch(target.value)}>
					<MagnifyingGlassSvg />
					<input
						class="user-search-input"
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
					<div class="search-user-list" tabIndex="0">
						<For each={recommendations()}>{(user, index) => <UserSearchItem user={user} index={index()} selected={index() === 0} />}</For>
					</div>
				</Show>

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

	if ((code === "Enter" && userSearchDialog?.querySelector("input").value === "") || code === "Escape") {
		userSearchDialog?.close();
		setSearch("");
		setError("");
		return;
	} else if (code === "ArrowUp" || (code === "Tab" && event.shiftKey)) {
		event.preventDefault();
		const user = userSearchDialog?.querySelector("[custom-selected]");
		if (!user) return;
		user.removeAttribute("custom-selected");
		const elem = user.previousElementSibling || user.parentElement.lastElementChild || user;
		elem?.setAttribute("custom-selected", "");
		elem?.scrollIntoView({ block: "nearest" });
	} else if (code === "ArrowDown" || code === "Tab") {
		event.preventDefault();
		const user = userSearchDialog?.querySelector("[custom-selected]");
		if (!user) return;
		user.removeAttribute("custom-selected");
		const elem = user.nextElementSibling || user.parentElement.firstElementChild || user;
		elem?.setAttribute("custom-selected", "");
		elem?.scrollIntoView({ block: "nearest" });
	}

	const selected = userSearchDialog?.querySelector("[custom-selected]");
	if (selected) {
		const index = Array.from(selected.parentElement.children).indexOf(selected);
		setSearchIndex(index);
	}
}

function openDialog() {
	userSearchDialog?.querySelector("input").select();
	userSearchDialog?.showModal();
}

export async function submitSearch(event) {
	event?.preventDefault?.();
	const input = userSearchDialog?.querySelector("input");
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

	setUserTable((users) => [...users, newUser]);
	updateAllUserLists();
	setSearchIndex(0);
}

export default UserSearch;
