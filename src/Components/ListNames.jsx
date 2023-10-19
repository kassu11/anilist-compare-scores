import { updateMediaData } from "./UserMedia";
import { setSelectedLists, mediaType, userTable, allUserLists, setAllUserLists, userListSelectionMemory } from "../utilities/signals";
import { fetchUserMedia } from "../api/anilist";

function ListTypes() {
	const custom = (list) => list.startsWith("c-");
	const notCustom = (list) => !list.startsWith("c-");
	const memory = (list) => userListSelectionMemory[mediaType()]["global"][list];

	return (
		<form id="checkboxRow" onInput={(e) => updateListType(e.currentTarget)}>
			<ul>
				<For each={allUserLists().filter(notCustom)}>
					{(item) =>
						item === "Custom" ? (
							<li>
								<details class="custom-list-dropdown">
									<summary>
										<input type="checkbox" name={item} id={item} checked={memory(item) ?? true} />
										<label htmlFor={item}>{item}</label>
										<span class="dropdown-lable">[more]</span>
									</summary>
									<ul>
										<For each={allUserLists().filter(custom)}>
											{(item) => (
												<li>
													<input type="checkbox" name={item} id={item} checked={memory(item)} />
													<label htmlFor={item}>{item.replace("c-", "")}</label>
												</li>
											)}
										</For>
									</ul>
								</details>
							</li>
						) : (
							<li>
								<input type="checkbox" name={item} id={item} checked={memory(item) ?? true} />
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
	const globalSettings = userListSelectionMemory[mediaType()]["global"];
	allUserLists().forEach((list) => {
		globalSettings[list] = list in data;
	});
	const types = Object.keys(data);

	if (types.includes("Custom")) {
		setSelectedLists(types.filter((type) => !type.startsWith("c-")));
	} else setSelectedLists(types);
	updateMediaData();
}

export async function updateAllUserLists() {
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
	setAllUserLists(uniqueListNames);
	updateListType(document.querySelector("#checkboxRow"));
}

export default ListTypes;
