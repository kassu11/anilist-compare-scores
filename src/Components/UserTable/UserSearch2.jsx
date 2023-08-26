import { fetchUsers } from "../../api/anilist";
import { createSignal, createResource } from "solid-js";
import { userTable, setUserTable, searchIndex, setSearchIndex } from "../../utilities/signals";
import { updateMediaInfoObject } from "../../utilities/updateMediaInfoObject";
import { updateMediaData } from "../UserMedia";

import UserSearchItem from "./UserSearchItem";

import style from "./UserSearch2.module.css";

const [search, setSearch] = createSignal();

function UserSearch() {
	const [recommendations] = createResource(search, fetchUsers);

	return (
		<>
			<p onClick={openDialog} className={style.search}><i class="fa-solid fa-magnifying-glass"></i> Search users</p>

			<dialog id="userSearch" className={style.userSearch} onFocus={closeOnFocus}>
				<div id="wrapper">
					<form onSubmit={submitSearch} onInput={({ target }) => setSearch(target.value)}>
						<i class="fa-solid fa-magnifying-glass"></i>
						<input className={style.userInput} onKeyDown={keyboard} type="search" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Type to search"></input>
					</form>
					<Show when={!recommendations.loading} fallback={UserSearchLoading}>
						<div className={style.userList} tabIndex="0">
							<For each={recommendations()}>{(user, index) => (
								<UserSearchItem user={user} index={index()} selected={index() === 0} />
							)}</For>
						</div>
					</Show>
				</div>
			</dialog>
		</>
	);

	function closeOnFocus(event) {
		if (event.target.tagName === "DIALOG") event.target.close();
	}
}


function UserSearchLoading() {
	const leading = new Array(5).fill(0);
	return (
		<For each={leading}>{() => (
			<div className={style.user}>
				<div className={style.loadingImage}></div>
				<span className={style.loadingName}>Loading...</span>
			</div>
		)}</For>
	);
}


function keyboard(event) {
	const { code } = event;

	if (code === "Enter" && document.querySelector("#userSearch input").value === "") {
		document.querySelector("#userSearch").close();
		setSearch("");
		return;
	}
	else if (code === "Escape") {
		document.querySelector("#userSearch").close();
		setSearch("");
	}
	else if (code === "ArrowUp" || (code === "Tab" && event.shiftKey)) {
		event.preventDefault();
		const user = document.querySelector(`.${style.user}[custom-selected="true"]`);
		if (!user) return;
		user.setAttribute("custom-selected", false);
		const elem = user.previousElementSibling || user;
		elem?.setAttribute("custom-selected", true);
		elem?.scrollIntoView({ block: "nearest" });
	}
	else if (code === "ArrowDown" || code === "Tab") {
		event.preventDefault();
		const user = document.querySelector(`.${style.user}[custom-selected="true"]`);
		if (!user) return;
		user.setAttribute("custom-selected", false);
		const elem = user.nextElementSibling || user;
		elem?.setAttribute("custom-selected", true);
		elem?.scrollIntoView({ block: "nearest" });
	}

	const selected = document.querySelector(`.${style.user}[custom-selected="true"]`);
	if (selected) {
		const index = Array.from(selected.parentElement.children).indexOf(selected);
		setSearchIndex(index);
	};
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

	if (!newUser?.name) return console.log("No users found");
	if (userTable().some(user => user.id === newUser.id)) return console.log("User already added");

	await updateMediaInfoObject(newUser);
	newUser.enabled = true;
	newUser.exclude = false;

	const users = [...userTable(), newUser]
	setUserTable(users);
	updateMediaData(users, undefined, undefined);
	setSearchIndex(0);
}


export default UserSearch;