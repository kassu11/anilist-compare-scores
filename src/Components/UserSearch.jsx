import { fetchUsers } from "../api/anilist";
import { createSignal, createResource } from "solid-js";
import { userTable, setUserTable } from "./UserTable";
import { setWidthBuffer } from "../utilities/buffer.js";
import { updateMediaInfoObject } from "../utilities/updateMediaInfoObject";
import { updateMediaData } from "./UserMedia";

import style from "./UserSearch.module.css";

const [search, setSearch] = createSignal();
export const [percentage, setPercentage] = createSignal(1);
let searchIndex = 0;

function UserSearch() {
	const [recommendations] = createResource(search, fetchUsers);

	return (
		<nav>
			<form>
				<ul>
					<li><button type="button" onClick={openDialog}>User Search</button></li>
					<li><input value="100" onInput={e => calcPercentage(e.target.value)} /></li>
					<li><input type="radio" name="mode" id="Intersect" checked /><label htmlFor="Intersect">Intersect</label></li>
					<li><input type="radio" name="mode" id="Exclude" /><label htmlFor="Exclude">Exclude</label></li>
					<li><input type="checkbox" name="zero" id="hideZero" /><label htmlFor="hideZero">Hide zero</label></li>
					<li><label for="sort">Sorting order </label>
						<select id="sort">
							<option value="volvo">Score</option>
							<option value="saab">Repeat</option>
							<option value="opel">Title</option>
						</select>
					</li>
				</ul>
			</form>

			<dialog id="userSearch">
				<form onSubmit={submitSearch} onInput={({ target }) => setSearch(target.value)}>
					<input autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"></input>
				</form>
				{/* {console.log(recommendations.loading)} */}
				<div className="userList">
					<For each={recommendations()}>{(user, index) => (
						<div className={style.user} tabIndex="0" onClick={() => {
							searchIndex = index();
							submitSearch();
						}}>
							<img src={user.avatar.medium} alt={user.name} height="25" />
							<span>{user.name}</span>
						</div>
					)}</For>
				</div>
			</dialog>
		</nav>
	)
}

function calcPercentage(string_value) {
	const value = (parseInt(string_value) / 100) || 0;
	const percentage = 1 / (userTable().length || 1);
	const ceilToClosestDiff = Math.ceil(value / percentage) * percentage;
	const fixTo2Ceil = Math.floor(ceilToClosestDiff * 100) / 100;
	setWidthBuffer(setPercentage, fixTo2Ceil)
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

	const users = [...userTable(), newUser]
	setUserTable(users);
	updateMediaData(users, undefined, undefined);
	searchIndex = 0;
}


export default UserSearch;