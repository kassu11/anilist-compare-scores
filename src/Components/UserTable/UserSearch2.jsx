import { fetchUsers } from "../../api/anilist";
import { createSignal, createResource } from "solid-js";
import { userTable, setUserTable } from "../../utilities/signals.js";
import { updateMediaInfoObject } from "../../utilities/updateMediaInfoObject";
import { updateMediaData } from "../UserMedia";

import style from "./UserSearch2.module.css";

const [search, setSearch] = createSignal();
let searchIndex = 0;

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
	)
}

function UserSearchItem({ user, selected, index }) {
	return (
		<div attr: custom-selected={selected} className={style.user} onClick={() => {
			searchIndex = index;
			submitSearch();
			document.querySelector("#userSearch input").focus();
		}} onMouseMove={e => {
			if (e.target.getAttribute("custom-selected") === "true") return;
			const users = document.querySelectorAll(`.${style.user}[custom-selected="true"]`);
			users.forEach(user => user.setAttribute("custom-selected", false));
			e.target.setAttribute("custom-selected", true);
		}}>
			<img src={user.avatar.medium} className={style.loading} onLoad={removeLoading} alt={user.name} height="25" />
			<span>{user.name}</span>
		</div>
	)
}


function removeLoading(e) {
	e.target.classList.remove(style.loading);
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
	)
}

function closeOnFocus(e) {
	if (e.target.tagName === "DIALOG") e.target.close();
}

function keyboard(e) {
	if(e.code === "Enter" && document.querySelector("#userSearch input").value === "") {
		document.querySelector("#userSearch").close();
		setSearch("");
		return;
	}
	else if (e.code === "Escape") {
		document.querySelector("#userSearch").close();
		setSearch("");
	}
	else if (e.code === "ArrowUp" || (e.code === "Tab" && e.shiftKey)) {
		e.preventDefault();
		const user = document.querySelector(`.${style.user}[custom-selected="true"]`);
		if (!user) return;
		user.setAttribute("custom-selected", false);
		const elem = user.previousElementSibling || user;
		elem?.setAttribute("custom-selected", true);
		elem?.scrollIntoView({ block: "nearest" });
	}
	else if (e.code === "ArrowDown" || e.code === "Tab") {
		e.preventDefault();
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
		searchIndex = index;
	};
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
	if (userTable().some(user => user.id === newUser.id)) return console.log("User already added");

	await updateMediaInfoObject(newUser);
	newUser.enabled = true;
	newUser.exclude = false;

	const users = [...userTable(), newUser]
	setUserTable(users);
	updateMediaData(users, undefined, undefined);
	searchIndex = 0;
}


export default UserSearch;