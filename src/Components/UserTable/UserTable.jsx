import { updateMediaData } from "../UserMedia";
import TrashCanSvg from "../Icons/TrashCan";
import UserSearch from "../UserSearch/UserSearch";
import { userTable, setUserTable } from "../../utilities/signals";
import IncludeUsersOption from "./UserIncludeBar";
import { updateAllUserLists } from "../ListNames";

import "../../style/settings.scss";

function UserTable() {
	return (
		<div class="userContainer">
			<div class="options">
				<UserSearch />
				<IncludeUsersOption />
			</div>
			<div class="user-grid">
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
					<input type="checkbox" for="enabled" onInput={(e) => changeUserState(e, user)} checked onClick={multiSelect} />
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
				<input type="checkbox" onInput={(e) => e.target.closest(".user-row").classList.toggle("open-advanced-info", e.target.checked)} />{" "}
				Advanced
			</label>
			<div class="exclude">
				<label class="hitbox">
					<input type="checkbox" for="exclude" onInput={(e) => changeExcludeState(e, user)} onClick={multiSelect} />
				</label>
			</div>
			<UserInfo />
		</div>
	);
}

function UserInfo({ user }) {
	return (
		<div class="user-advanced-info">
			<form>
				<ul>
					<li>
						<input type="checkbox" name="Completed" id="Completed"></input>
						<label for="Completed">Completed</label>
					</li>
					<li>
						<details class="custom-list-dropdown">
							<summary>
								<input type="checkbox" name="Custom" id="Custom"></input>
								<label for="Custom">Custom</label>
								<span class="dropdown-lable">[more]</span>
							</summary>
							<ul>
								<li>
									<input type="checkbox" name="c-Dabbled" id="c-Dabbled"></input>
									<label for="c-Dabbled">Dabbled</label>
								</li>
								<li>
									<input type="checkbox" name="c-Extras" id="c-Extras"></input>
									<label for="c-Extras">Extras</label>
								</li>
								<li>
									<input type="checkbox" name="c-Rewatched" id="c-Rewatched"></input>
									<label for="c-Rewatched">Rewatched</label>
								</li>
							</ul>
						</details>
					</li>
					<li>
						<input type="checkbox" name="Dropped" id="Dropped"></input>
						<label for="Dropped">Dropped</label>
					</li>
					<li>
						<input type="checkbox" name="Planning" id="Planning"></input>
						<label for="Planning">Planning</label>
					</li>
					<li>
						<input type="checkbox" name="Rewatched" id="Rewatched"></input>
						<label for="Rewatched">Rewatched</label>
					</li>
					<li>
						<input type="checkbox" name="Watching" id="Watching"></input>
						<label for="Watching">Watching</label>
					</li>
				</ul>
			</form>
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

function multiSelect(event) {
	if (!event.shiftKey) return;
	const forType = event.target.getAttribute("for");
	const checkboxes = document.querySelectorAll(`input[for="${forType}"]`);
	let sum = 0;
	for (const checkbox of checkboxes) {
		if (checkbox.checked) sum++;
		else break;
	}

	if (sum === checkboxes.length && event.target.checked) {
		checkboxes.forEach((input) => (input.checked = false));
	} else {
		checkboxes.forEach((input) => (input.checked = true));
		event.target.checked = false;
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

async function changeExcludeState(e, user) {
	user.exclude = e.target.checked;
	e.target.closest(".user-row").classList.toggle("excludeRow", e.target.checked);
	setUserTable((users) => [...users]);
	await updateAllUserLists();
}

async function changeUserState(e, user) {
	user.enabled = e.target.checked;
	e.target.closest(".user-row").classList.toggle("disabled", !e.target.checked);
	setUserTable((users) => [...users]);
	await updateAllUserLists();
}

export default UserTable;
