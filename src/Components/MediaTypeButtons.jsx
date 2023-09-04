import { setMediaType } from "../utilities/signals";
import { updateListType } from "./ListTypes";
import { userListOrder } from "./UserMedia";

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

function updateMediaType(form) {
	const { type } = Object.fromEntries(new FormData(form));
	userListOrder[userListOrder.Rewatched] = type === "ANIME" ? "Rewatched" : "Reread";
	setMediaType(type);
	updateListType(document.querySelector("#checkboxRow"));
}

export default MediaTypeButtons;
