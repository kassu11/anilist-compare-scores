import { updateMediaData } from "./UserMedia";

import { setListType } from "../utilities/signals";

function ListTypes() {
	return (
		<form id="checkboxRow" onInput={(e) => updateListType(e.currentTarget)} use:updateListType>
			<ul>
				<li>
					<input type="checkbox" name="Completed" id="Completed" checked /> <label htmlFor="Completed">Completed</label>
				</li>
				<li>
					<input type="checkbox" name="Watching" id="Watching" checked /> <label htmlFor="Watching">Watching</label>
				</li>
				<li>
					<input type="checkbox" name="Rewatched" id="Rewatched" /> <label htmlFor="Rewatched">Rewatched</label>
				</li>
				<li>
					<input type="checkbox" name="Paused" id="Paused" /> <label htmlFor="Paused">Paused</label>
				</li>
				<li>
					<input type="checkbox" name="Dropped" id="Dropped" /> <label htmlFor="Dropped">Dropped</label>
				</li>
				<li>
					<input type="checkbox" name="Planning" id="Planning" /> <label htmlFor="Planning">Planning</label>
				</li>
				<li>
					<input type="checkbox" name="Custom" id="Custom" /> <label htmlFor="Custom">Custom</label>
				</li>
			</ul>
		</form>
	);
}

function updateListType(formElem) {
	const data = Object.fromEntries(new FormData(formElem));
	const types = Object.keys(data);
	setListType(types);
	updateMediaData();
}

export default ListTypes;
