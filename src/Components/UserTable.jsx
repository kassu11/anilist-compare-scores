import { createSignal } from "solid-js";
import { updateMediaData } from "./UserMedia";

import style from "./UserTable.module.css";

export const [userTable, setUserTable] = createSignal([]);

function UserTable() {
	return (
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
				<For each={userTable()}>{user => (
					<tr>
						<td>
							<div className={style.center}>
								<input type="checkbox" for="enabled" onInput={e => changeUserState(e, user)} checked onClick={multiSelect} />
								<div className={style.hamburger}></div>
								<TrashCan user={user} />
							</div>
						</td>
						<td>
							<div className={style.center}>
								<img src={user.avatar.medium} alt={user.name} height="25" /> {user.name}
							</div>
						</td>
						<td>{user.statistics.anime.count}</td>
						<td className={style.close}>{user.statistics.anime.meanScore}</td>
						<td>{Math.round(user.statistics.anime.minutesWatched / 60)}</td>
						<td>{user.statistics.manga.count}</td>
						<td className={style.close}>{user.statistics.manga.meanScore}</td>
						<td>{Math.round(user.statistics.manga.chaptersRead)}</td>
						<td className={style.exclude}><input type="checkbox" for="exclude" onInput={e => changeExcludeState(e, user)} onClick={multiSelect} /></td>
					</tr>
				)}</For>
			</tbody>
		</table>
	)
}


function TrashCan({ user }) {
	return (
		<div className={style.trash} onClick={() => {
			const users = userTable().filter((u) => u.id !== user.id);
			setUserTable(users);
			updateMediaData(users);
		}}>
			<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" /></svg>
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
	users.forEach((user, index) => user[forType] = checkboxes[index].checked);
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
	e.target.closest("tr").classList.toggle(style.disabled);
	const users = [...userTable()];
	setUserTable(users);
	updateMediaData(users);
}



export default UserTable;