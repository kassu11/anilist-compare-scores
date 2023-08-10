import { fetchUsers, fetchUserMedia } from "../api/anilist";
import { createSignal, createResource } from "solid-js";
import { userTable, setUserTable } from "./UserTable";
import { mediaInfo } from "./UserMedia";
import { setWidthBuffer } from "../utilities/buffer.js";

export const navSettings = {
	percentage: 1
}

const [search, setSearch] = createSignal();
export const [percentage, setPercentage] = createSignal(1);

function UserSearch() {
	const [recommendations] = createResource(search, fetchUsers);

	return (
		<nav>
			<form>
				<ul>
					<li><button type="button" onClick={openDialog}>User Search</button></li>
					<li><input value="100" onInput={e => calcPercentage(e.target.value)} /></li>
					<li><input type="radio" name="mode" id="Include" checked /><label htmlFor="Intersect">Intersect</label></li>
					<li><input type="radio" name="mode" id="Exclude" /><label htmlFor="Exclude">Exclude</label></li>
				</ul>
			</form>

			<dialog id="userSearch">
				<form onSubmit={submitSearch} onInput={({ target }) => setSearch(target.value)}>
					<input autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"></input>
				</form>
				{console.log(recommendations.loading)}
				<div className="userList">
					<For each={recommendations()}>{user => (
						<div className="user" tabIndex="0">
							<img src={user.avatar.medium} alt={user.name} height="25" />
							<span>{user.name}</span>
						</div>
					)}</For>
				</div>
			</dialog>

			{console.log(recommendations())}
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
	event.preventDefault();
	const input = event.target.querySelector("input");
	const userName = input.value;
	input.value = "";
	setSearch("");
	if (!userName) return console.log("No input");

	const [newUser] = await fetchUsers(userName);
	if (!newUser?.name) return console.log("No users found");
	if (userTable().some(user => user.id === newUser.id)) return console.log("User already added");

	const userMedia = await fetchUserMedia(newUser);
	for (const list of userMedia.MediaListCollection.lists) {
		for (const userStats of list.entries) {
			if (userStats.media.id in mediaInfo) {
				mediaInfo[userStats.media.id].userScores[newUser.name] = userStats.score
				mediaInfo[userStats.media.id].userRepeats[newUser.name] = userStats.repeat;
				continue;
			}
			mediaInfo[userStats.media.id] = userStats.media;
			mediaInfo[userStats.media.id].userScores = { [newUser.name]: userStats.score };
			mediaInfo[userStats.media.id].userRepeats = { [newUser.name]: userStats.repeat };
		}
	}

	setUserTable([...userTable(), newUser]);
	console.log(mediaInfo)
}


export default UserSearch;