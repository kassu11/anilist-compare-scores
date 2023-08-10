import { fetchUsers, fetchUserMedia } from "../api/anilist";
import { createSignal, createResource } from "solid-js";
import { userTable, setUserTable } from "./UserTable";
import { mediaInfo } from "./UserMedia";

const [search, setSearch] = createSignal();

function UserSearch() {
	const [recommendations] = createResource(search, fetchUsers);

	return (
		<nav>
			<form>
				<ul>
					<li><button type="button" onClick={openDialog}>User Search</button></li>
					<li><input type="radio" name="mode" id="All" checked /><label htmlFor="All">All</label></li>
					<li><input type="radio" name="mode" id="Intersect" /><label htmlFor="Intersect">Intersect</label></li>
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
				mediaInfo[userStats.media.id].users[newUser.name] = userStats.score
				continue;
			}
			mediaInfo[userStats.media.id] = userStats.media;
			mediaInfo[userStats.media.id].users = { [newUser.name]: userStats.score };
		}
	}

	setUserTable([...userTable(), newUser]);
	console.log(mediaInfo)
}


export default UserSearch;