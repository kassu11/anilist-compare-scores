import { updateMediaData } from "../UserMedia";
import TrashCan from "../Icons/TrashCan";
import EmptyUserTable from "./EmptyUserTable";

import style from "./UserTable.module.css";

import UserSearch2 from "./UserSearch2";
import { userTable, setUserTable } from "../../utilities/signals.js"


function UserTable() {
	return (
		<div className={style.usersTable}>
			<div className={style.options}>
				<UserSearch2 />
				<p>
					Inclusion <input type="text" value="100" /> %
				</p>
			</div>
			<table>
				<thead>
					<tr>
						<th>Selection</th>
						<th>Name</th>
						<th>Anime</th>
						<th className={style.close}>Score</th>
						<th className={style.paddingRight}>Hours</th>
						<th>Manga</th>
						<th className={style.close}>Score</th>
						<th className={style.paddingRight}>Chapters</th>
						<th>Exclude</th>
					</tr>
				</thead>
				<tbody>
					<For each={userTable()} fallback={<EmptyUserTable />}>{user => (
						<tr>
							<td>
								<div className={style.center}>
									<label className={style.hitbox}>
										<input type="checkbox" for="enabled" onInput={e => changeUserState(e, user)} checked onClick={multiSelect} />
									</label>
									<div className={style.hamburger}></div>
									<RemoveUser user={user} />
								</div>
							</td>
							<td>
								<div className={style.center}>
									<img src={user.avatar.medium} alt={user.name} className={style.profile} height="25" /> {user.name}
								</div>
							</td>
							<td>{user.statistics.anime.count}</td>
							<td className={style.close}>{user.statistics.anime.meanScore}</td>
							<td>{Math.round(user.statistics.anime.minutesWatched / 60)}</td>
							<td>{user.statistics.manga.count}</td>
							<td className={style.close}>{user.statistics.manga.meanScore}</td>
							<td>{Math.round(user.statistics.manga.chaptersRead)}</td>
							<td className={style.exclude}>
								<label className={style.hitbox}>
									<input type="checkbox" for="exclude" onInput={e => changeExcludeState(e, user)} onClick={multiSelect} />
								</label>
							</td>
						</tr>
					)}</For>
				</tbody>
			</table>
		</div>
	)
}


function RemoveUser({ user }) {
	return (
		<div className={style.trash} onClick={() => {
			const users = userTable().filter((u) => u.id !== user.id);
			setUserTable(users);
			updateMediaData(users);
		}}>
			<TrashCan />
		</div>
	)
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
		checkboxes.forEach(input => input.checked = false);
	} else {
		checkboxes.forEach(input => input.checked = true);
		event.target.checked = false;
	}

	const users = [...userTable()];
	users.forEach((user, index) => {
		user[forType] = checkboxes[index].checked;
		if (forType === "enabled") checkboxes[index].closest("tr").classList.toggle(style.disabled, !checkboxes[index].checked);
	});
	setUserTable(users);
}


function changeExcludeState(e, user) {
	user.exclude = e.target.checked;
	const users = [...userTable()];
	setUserTable(users);
	updateMediaData(users);
}



function changeUserState(e, user) {
	user.enabled = e.target.checked;
	e.target.closest("tr").classList.toggle(style.disabled, !e.target.checked);
	const users = [...userTable()];
	setUserTable(users);
	updateMediaData(users);
}



export default UserTable;