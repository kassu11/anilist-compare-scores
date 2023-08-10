import { createSignal } from "solid-js";

export const [userTable, setUserTable] = createSignal([]);

function UserTable() {
	return (
		<table>
			<thead>
				<tr>
					<th>User</th>
					<th>Anime</th>
					<th>Mean score</th>
					<th>Hours watched</th>
					<th>Manga</th>
					<th>Mean score</th>
					<th>Chapters read</th>
				</tr>
			</thead>
			<tbody>
				<For each={userTable()}>{user => (
					<tr>
						<td><img src={user.avatar.medium} alt={user.name} height="25" /> {user.name}</td>
						<td>{user.statistics.anime.count}</td>
						<td>{user.statistics.anime.meanScore}</td>
						<td>{Math.round(user.statistics.anime.minutesWatched / 60)}</td>
						<td>{user.statistics.manga.count}</td>
						<td>{user.statistics.manga.meanScore}</td>
						<td>{Math.round(user.statistics.manga.chaptersRead)}</td>
					</tr>
				)}</For>
			</tbody>
		</table>
	)
}

export default UserTable;