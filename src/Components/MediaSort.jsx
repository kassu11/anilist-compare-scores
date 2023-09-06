import { setSortValue } from "../utilities/signals";
import { updateMediaData } from "./UserMedia";

function MediaSort() {
	return (
		<select id="sort" onInput={sortSelect}>
			<option value="score">Score</option>
			<option value="repeat">Repeat</option>
			<option value="title">Title</option>
		</select>
	);
}

function sortSelect(e) {
	setSortValue(e.target.value);
	updateMediaData();
}

export default MediaSort;
