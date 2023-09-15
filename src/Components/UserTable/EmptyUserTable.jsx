import TrashCan from "../Icons/TrashCan";

import "../../style/settings.scss";

function EmptyUserTable() {
	return (
		<tr class="empty">
			<td>
				<div class="center">
					<label class="hitbox">
						<input type="checkbox" for="enabled" checked disabled />
					</label>
					<div class="hamburger"></div>
					<div class="trash">
						<TrashCan />
					</div>
				</div>
			</td>
			<td>
				<div class="center">
					<div class="fillerImage"></div>
					<span>----------</span>
				</div>
			</td>
			<td>
				<span>------</span>
			</td>
			<td class="close">
				<span>------</span>
			</td>
			<td>
				<span>-------</span>
			</td>
			<td>
				<span>-------</span>
			</td>
			<td class="close">
				<span>-------</span>
			</td>
			<td>
				<span>-------</span>
			</td>
			<td class="exclude">
				<label class="hitbox">
					<input type="checkbox" for="exclude" disabled />
				</label>
			</td>
		</tr>
	);
}

export default EmptyUserTable;
