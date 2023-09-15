import style from "./UserTable.module.css";
import TrashCan from "../Icons/TrashCan";

function EmptyUserTable() {
	return (
		<tr className={style.empty}>
			<td>
				<div className={style.center}>
					<label className={style.hitbox}>
						<input type="checkbox" for="enabled" checked disabled />
					</label>
					<div className={style.hamburger}></div>
					<div className={style.trash}>
						<TrashCan />
					</div>
				</div>
			</td>
			<td>
				<div className={style.center}>
					<div className={style.fillerImage}></div>
					<span>----------</span>
				</div>
			</td>
			<td>
				<span>------</span>
			</td>
			<td className={style.close}>
				<span>------</span>
			</td>
			<td>
				<span>-------</span>
			</td>
			<td>
				<span>-------</span>
			</td>
			<td className={style.close}>
				<span>-------</span>
			</td>
			<td>
				<span>-------</span>
			</td>
			<td className={style.exclude}>
				<label className={style.hitbox}>
					<input type="checkbox" for="exclude" disabled />
				</label>
			</td>
		</tr>
	);
}

export default EmptyUserTable;
