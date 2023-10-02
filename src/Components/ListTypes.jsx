import { updateMediaData } from "./UserMedia";
import { setListType, mediaType, animeUserList, mangaUserList } from "../utilities/signals";

const customList = {
	Completed: false,
	Watching: false,
	Rewatched: false,
	Paused: false,
	Dropped: false,
	Planning: false,
	Custom: false,
};

function ListTypes() {
	return (
		<form id="checkboxRow" onInput={(e) => updateListType(e.currentTarget)}>
			<ul>
				<For each={mediaType() === "ANIME" ? animeUserList() : mangaUserList()}>
					{(item) => (
						<li>
							<input type="checkbox" name={item} id={item} checked />
							<label htmlFor={item}>{item}</label>
						</li>
					)}
				</For>
			</ul>
		</form>
	);
}

export function updateListType(formElem) {
	const data = Object.fromEntries(new FormData(formElem));
	const types = Object.keys(data);
	setListType(types);
	updateMediaData();
}

export default ListTypes;
