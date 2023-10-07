import { updateMediaData } from "./UserMedia";
import { setListType, mediaType, userTable, activeUserList, setActiveUserList, userListSelectionMemory } from "../utilities/signals";
import { fetchUserMedia } from "../api/anilist";

function ListTypes() {
	const custom = (list) => list.startsWith("c-");
	const notCustom = (list) => !list.startsWith("c-");
	return (
		<form id="checkboxRow" onInput={(e) => updateListType(e.currentTarget)}>
			<ul>
				<For each={activeUserList().filter(notCustom)}>
					{(item) =>
						item === "Custom" ? (
							<li>
								<details class="custom-list-dropdown">
									<summary>
										<input type="checkbox" name={item} id={item} checked={userListSelectionMemory[mediaType()][item] ?? true} />
										<label htmlFor={item}>{item}</label>
										<span class="dropdown-lable">[more]</span>
									</summary>
									<ul>
										<For each={activeUserList().filter(custom)}>
											{(item) => (
												<li>
													<input type="checkbox" name={item} id={item} checked={userListSelectionMemory[mediaType()][item]} />
													<label htmlFor={item}>{item.replace("c-", "")}</label>
												</li>
											)}
										</For>
									</ul>
								</details>
							</li>
						) : (
							<li>
								<input type="checkbox" name={item} id={item} checked={userListSelectionMemory[mediaType()][item] ?? true} />
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
	console.trace("updateListType");
	const data = Object.fromEntries(new FormData(formElem));
	activeUserList().forEach((list) => {
		userListSelectionMemory[mediaType()][list] = list in data;
	});
	const types = Object.keys(data);

	if (types.includes("Custom")) {
		setListType(types.filter((type) => !type.startsWith("c-")));
	} else setListType(types);
	updateMediaData();
}

export async function updateActiveUserLists() {
	console.trace("updateActiveUserLists");
	const users = userTable().filter((u) => u.enabled && !u.exclude);
	let hasCustom = false;
	const activeList = [];
	for (const user of users) {
		const lists = await fetchUserMedia(user, mediaType());
		lists.forEach((list) => {
			activeList.push(list.name);
			if (list.isCustomList) hasCustom = true;
		});
	}

	if (hasCustom) activeList.push("Custom");
	const uniqueListNames = [...new Set(activeList)].sort();
	setActiveUserList(uniqueListNames);
	updateListType(document.querySelector("#checkboxRow"));
}

// function getSelectedLists() {
// 	const type = mediaType();
// 	const selectedList = activeUserList().filter((list) => {
// 		if (userListSelectionMemory[type].Custom && list.startsWith("c-")) return false;
// 		return userListSelectionMemory[type][list] ?? true; // If not in memory, default to true
// 	});

// 	return selectedList;
// }

export default ListTypes;
