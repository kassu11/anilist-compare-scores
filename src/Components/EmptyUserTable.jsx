import style from "./UserSearch.module.css";

function EmptyUserTable() {
	return (
		<tr>
			<td>
				<div className={style.center}>
					<label className={style.hitbox}>
						<input type="checkbox" for="enabled" checked />
					</label>
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
			<td className={style.exclude}>
				<label className={style.hitbox}>
					<input type="checkbox" for="exclude" onInput={e => changeExcludeState(e, user)} onClick={multiSelect} />
				</label>
			</td>
		</tr>
	);
}

export default EmptyUserTable;