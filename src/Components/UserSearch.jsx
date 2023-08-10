import { fetchUsers } from "../api/anilist";
import { createSignal, createResource } from "solid-js";
import { userTable, setUserTable } from "./UserTable";

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
				<form onSubmit={e => test(e)} onInput={e => setSearch(e.target.value)}>
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

async function test(e) {
	e.preventDefault();
	const input = e.target.querySelector("input");
	const userName = input.value;
	input.value = "";
	setSearch("");
	if (!userName) return console.log("No input");

	const users = await fetchUsers(userName);
	if (!users?.length) return console.log("No users found");

	if (userTable.every((id) => id !== users[0].id)) setUserTable([...userTable, users[0]]);
	console.log("searched user:", users[0]);
	console.log(userTable);
}


export default UserSearch;