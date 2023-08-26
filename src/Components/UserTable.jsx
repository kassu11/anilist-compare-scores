import { createSignal } from "solid-js";
import { updateMediaData } from "./UserMedia";
import TrashCan from "./Icons/TrashCan";

import style from "./UserTable.module.css";

export const [userTable, setUserTable] = createSignal([]);

function UserTable() {
	return (
		<>
			<p><i class="fa-solid fa-magnifying-glass"></i> Searched Users 0</p>
			<select name="" id="">
				<option value="">10</option>
				<option value="">20</option>
				<option value="">30</option>
			</select>
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
					<For each={userTable()} fallback={<div>test</div>}>{user => (
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
									<img src={user.avatar.medium} alt={user.name} height="25" /> {user.name}
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
		</>
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