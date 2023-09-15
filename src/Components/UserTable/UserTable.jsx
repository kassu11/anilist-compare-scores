import { updateMediaData } from "../UserMedia";
import TrashCanSvg from "../Icons/TrashCan";
import EmptyUserTable from "./EmptyUserTable";
import UserSearch2 from "./UserSearch2";
import { userTable, setUserTable } from "../../utilities/signals";
import IncludeUsersOption from "./UserIncludeBar";

import "../../style/settings.scss";

function UserTable() {
	return (
		<div class="usersTable">
			<div class="options">
				<UserSearch2 />
				<IncludeUsersOption />
			</div>
			<table>
				<thead>
					<tr>
						<th>Selection</th>
						<th>Name</th>
						<th>Anime</th>
						<th class="close">Score</th>
						<th class="paddingRight">Hours</th>
						<th>Manga</th>
						<th class="close">Score</th>
						<th class="paddingRight">Chapters</th>
						<th>Exclude</th>
					</tr>
				</thead>
				<tbody>
					<For each={userTable()} fallback={<EmptyUserTable />}>
						{(user) => (
							<tr>
								<td>
									<div class="center">
										<label class="hitbox">
											<input type="checkbox" for="enabled" onInput={(e) => changeUserState(e, user)} checked onClick={multiSelect} />
										</label>
										<div class="hamburger"></div>
										<RemoveUser user={user} />
									</div>
								</td>
								<td>
									<div class="center">
										<img src={user.avatar.medium} alt={user.name} class="profile" height="25" /> {user.name}
									</div>
								</td>
								<td>{user.statistics.anime.count}</td>
								<td class="close">{user.statistics.anime.meanScore}</td>
								<td>{Math.round(user.statistics.anime.minutesWatched / 60)}</td>
								<td>{user.statistics.manga.count}</td>
								<td class="close">{user.statistics.manga.meanScore}</td>
								<td>{Math.round(user.statistics.manga.chaptersRead)}</td>
								<td class="exclude">
									<label class="hitbox">
										<input type="checkbox" for="exclude" onInput={(e) => changeExcludeState(e, user)} onClick={multiSelect} />
									</label>
								</td>
							</tr>
						)}
					</For>
				</tbody>
			</table>
		</div>
	);
}

function RemoveUser({ user }) {
	return (
		<div
			class="trash"
			onClick={() => {
				const users = userTable().filter((u) => u.id !== user.id);
				setUserTable(users);
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

	const users = [...userTable()];
	users.forEach((user, index) => {
		user[forType] = checkboxes[index].checked;
		if (forType === "enabled") checkboxes[index].closest("tr").classList.toggle("disabled", !checkboxes[index].checked);
		else if (forType === "exclude") checkboxes[index].closest("tr").classList.toggle("excludeRow", checkboxes[index].checked);
	});
	setUserTable(users);
}

function changeExcludeState(e, user) {
	user.exclude = e.target.checked;
	e.target.closest("tr").classList.toggle("excludeRow", e.target.checked);
	const users = [...userTable()];
	setUserTable(users);
	updateMediaData();
}

function changeUserState(e, user) {
	user.enabled = e.target.checked;
	e.target.closest("tr").classList.toggle("disabled", !e.target.checked);
	const users = [...userTable()];
	setUserTable(users);
	updateMediaData();
}

export default UserTable;
