import { createSignal } from "solid-js"
import { updateMediaData } from "./UserMedia";

export const [mediaType, setMediaType] = createSignal("ANIME");

function MediaTypeButtons() {
	return (
		<form onInput={e => updateMediaType(e.currentTarget)}>
			<input type="radio" name="type" value="ANIME" id="typeAnime" checked /><label htmlFor="typeAnime">Anime</label>
			<input type="radio" name="type" value="MANGA" id="typeManga" /><label htmlFor="typeManga">Manga</label>
		</form>
	)
}

function updateMediaType(form) {
	const { type } = Object.fromEntries(new FormData(form));
	setMediaType(type);
	updateMediaData(undefined, undefined, type)
}

export default MediaTypeButtons;