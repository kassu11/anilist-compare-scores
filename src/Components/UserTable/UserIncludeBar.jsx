import { setWithBuffer } from "../../utilities/buffer.js";
import { userTable, setPercentage, percentage } from "../../utilities/signals";

import "../../style/settings.scss";

function IncludeUsersOption() {
	return (
		<div class="include-container-row">
			<Show when={userTable().length}>
				<span class="user-count">Users ({Math.round(getActiveUsersCount() * percentage())})</span>
			</Show>
			<label for="include">Include</label>
			<input
				class="include-percentage"
				onKeyDown={customArrows}
				onInput={calcPercentage}
				type="number"
				value="100"
				id="include"
				placeholder="0"
			/>
			<span class="include-percentage-symbol">%</span>
		</div>
	);
}

const getActiveUsersCount = () => userTable().filter((u) => u.enabled && !u.exclude).length || 1;

function customArrows(event) {
	const input = event.target;
	const inputValue = parseInt(input.value) / 100;
	const activeUserCount = getActiveUsersCount();
	const values = Array(activeUserCount + 1)
		.fill(activeUserCount)
		.map((v, i) => i / v);
	let index = Math.max(
		values.findIndex((v) => v >= inputValue),
		0
	);

	if (event.code === "ArrowDown" || event.code === "KeyS") changeValue("down");
	else if (event.code === "ArrowUp" || event.code === "KeyW") changeValue("up");

	function changeValue(direction) {
		event.preventDefault();
		if (direction === "up" && index < activeUserCount) index++;
		else if (direction === "down" && index > 0) index--;

		const num = Math.floor(values[index] * 100);
		input.value = num;
		calcPercentage(event);
	}
}

function calcPercentage(event) {
	const input = event.target;
	const inputValue = parseInt(input.value.replace(/[^0-9]/g, "")) || 0;
	const minmaxValue = Math.min(Math.max(inputValue, 0), 100);
	input.value = minmaxValue;

	const value = minmaxValue / 100 || 0;
	const activeUserCount = getActiveUsersCount();
	const percentage = 1 / activeUserCount;
	const ceilToClosestDiff = Math.ceil(value / percentage) * percentage;
	const fixTo2Ceil = Math.floor(ceilToClosestDiff * 100) / 100;
	setWithBuffer(setPercentage, fixTo2Ceil);
}

export default IncludeUsersOption;
