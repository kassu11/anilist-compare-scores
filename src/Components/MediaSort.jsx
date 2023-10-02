import { setSortValue } from "../utilities/signals";
import { updateMediaData } from "./UserMedia";

function MediaSort() {
	return (
		<select id="sort" onInput={sortSelect}>
			<option value="score">User score</option>
			<option value="repeat">Repeats</option>
			<option value="title">Title</option>
			<option value="averageScore">Global Score</option>
		</select>
	);
}

function sortSelect(e) {
	setSortValue(e.target.value);
	updateMediaData();
}

export default MediaSort;
