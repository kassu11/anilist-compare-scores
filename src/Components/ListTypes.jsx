import { updateMediaData } from "./UserMedia";
import { setListType, mediaType, animeUserList, mangaUserList } from "../utilities/signals";

const notCustomList = {
	Completed: true,
	Watching: true,
	Rewatched: true,
	Paused: true,
	Dropped: true,
	Planning: true,
	Custom: true,
	Rewatching: true,
};

function ListTypes() {
	return (
		<form id="checkboxRow" onInput={(e) => updateListType(e.currentTarget)}>
			<ul>
				<For each={(mediaType() === "ANIME" ? animeUserList() : mangaUserList()).filter((list) => notCustomList[list])}>
					{(item) =>
						item === "Custom" ? (
							<li>
								<details class="custom-list-dropdown">
									<summary>
										<input type="checkbox" name={item} id={item} checked />
										<label htmlFor={item}>{item}</label>
										<span class="dropdown-lable">[more]</span>
									</summary>
									<ul>
										<For each={(mediaType() === "ANIME" ? animeUserList() : mangaUserList()).filter((list) => !notCustomList[list])}>
											{(item) => (
												<li>
													<input type="checkbox" name={item} id={item} />
													<label htmlFor={item}>{item}</label>
												</li>
											)}
										</For>
									</ul>
								</details>
							</li>
						) : (
							<li>
								<input type="checkbox" name={item} id={item} checked />
								<label htmlFor={item}>{item}</label>
							</li>
						)
					}
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
