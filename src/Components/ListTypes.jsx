import { updateMediaData } from "./UserMedia";
import { setListType, mediaType, animeUserList, mangaUserList } from "../utilities/signals";
import { createEffect } from "solid-js";

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
	const watchingReading = () => (mediaType() === "ANIME" ? "Watching" : "Reading");
	const rewachedReread = () => (mediaType() === "ANIME" ? "Rewatched" : "Reread");

	// <form use:updateListType> activates before functions are called, so watchingReading will break;
	setTimeout(() => updateListType(document.querySelector("#checkboxRow")), 0);

	// createEffect(() => {
	// 	if()
	// });

	return (
		<form id="checkboxRow" onInput={(e) => updateListType(e.currentTarget)}>
			{console.log(animeUserList(), mangaUserList())}

			<ul>
				<For each={mediaType() === "ANIME" ? animeUserList() : mangaUserList()}>
					{(item) => (
						<li>
							<input type="checkbox" name={item} id={item} checked />
							<label htmlFor={item}>{item}</label>
						</li>
					)}
				</For>
				{/* <li>
					<input type="checkbox" name="Completed" id="Completed" checked />
					<label htmlFor="Completed">Completed</label>
				</li>
				<li>
					<input type="checkbox" name={watchingReading()} id={watchingReading()} checked />
					<label htmlFor={watchingReading()}>{watchingReading()}</label>
				</li>
				<li>
					<input type="checkbox" name={rewachedReread()} id={rewachedReread()} />
					<label htmlFor={rewachedReread()}>{rewachedReread()}</label>
				</li>
				<li>
					<input type="checkbox" name="Paused" id="Paused" />
					<label htmlFor="Paused">Paused</label>
				</li>
				<li>
					<input type="checkbox" name="Dropped" id="Dropped" />
					<label htmlFor="Dropped">Dropped</label>
				</li>
				<li>
					<input type="checkbox" name="Planning" id="Planning" />
					<label htmlFor="Planning">Planning</label>
				</li>
				<li>
					<input type="checkbox" name="Custom" id="Custom" />
					<label htmlFor="Custom">Custom</label>
				</li> */}
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
