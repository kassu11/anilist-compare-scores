import { createSignal } from "solid-js"

export const [mediaType, setMediaType] = createSignal("ANIME");

function MediaTypeButtons() {
	return (
		<>
			<button onClick={() => setMediaType("ANIME")}>Anime</button>
			<button onClick={() => setMediaType("MANGA")}>Manga</button>
		</>
	)
}

export default MediaTypeButtons;