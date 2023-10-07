import { setMediaType } from "../utilities/signals";
import { updateActiveUserLists } from "./ListNames";
import { updateMediaData } from "./UserMedia";

function MediaTypeButtons() {
	return (
		<form onInput={(e) => updateMediaType(e.currentTarget)}>
			<input type="radio" name="type" value="ANIME" id="typeAnime" checked />
			<label htmlFor="typeAnime">Anime</label>
			<input type="radio" name="type" value="MANGA" id="typeManga" />
			<label htmlFor="typeManga">Manga</label>
		</form>
	);
}

async function updateMediaType(form) {
	const { type } = Object.fromEntries(new FormData(form));
	setMediaType(type);
	await updateMediaData();

	updateActiveUserLists();
}

export default MediaTypeButtons;
