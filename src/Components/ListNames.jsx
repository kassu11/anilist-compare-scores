import { updateMediaData } from "./UserMedia";
import { setSelectedLists, mediaType, userTable, allUserLists, setAllUserLists, userListSelectionMemory } from "../utilities/signals";
import { fetchUserMedia } from "../api/anilist";

const custom = (list) => list.startsWith("c-");
const notCustom = (list) => !list.startsWith("c-");
const memory = (scope, listName) => userListSelectionMemory[mediaType()][scope]?.[listName];

const defaultScope = "global";

function ListTypes({ values = allUserLists }) {
	return (
		<form id="checkboxRow" onInput={(e) => updateListType(e.currentTarget)}>
			<SelectionList values={values} scope={defaultScope} />
		</form>
	);
}

export function SelectionList({ values = allUserLists, scope = defaultScope }) {
	return (
		<ul>
			<For each={values().filter(notCustom)}>
				{(item) => (
					<Show when={item === "Custom"} fallback={<ListItem id={item} scope={scope} checked={true} />}>
						<CustomList values={values} scope={scope} />
					</Show>
				)}
			</For>
		</ul>
	);
}

const CustomList = ({ values = allUserLists, scope }) => (
	<li>
		<details class="custom-list-dropdown">
			<summary>
				<ListValues id="Custom" scope={scope} checked={true} />
				<span class="dropdown-lable">[more]</span>
			</summary>
			<ul>
				<For each={values().filter(custom)}>{(item) => <ListItem id={item} scope={scope} />}</For>
			</ul>
		</details>
	</li>
);

const ListItem = ({ id, checked, scope }) => (
	<li>
		<ListValues id={id} checked={checked} scope={scope} />
	</li>
);

const ListValues = ({ id, checked = false, scope }) => (
	<>
		<input type="checkbox" name={id} id={scope + id} checked={memory(scope, id) ?? checked} />
		<label htmlFor={scope + id}>{id.replace("c-", "")}</label>
	</>
);

export function updateListType(formElem) {
	const data = Object.fromEntries(new FormData(formElem));
	const globalSettings = userListSelectionMemory[mediaType()][defaultScope];
	allUserLists().forEach((list) => (globalSettings[list] = list in data));
	const types = Object.keys(data);

	if (types.includes("Custom")) {
		setSelectedLists(types.filter((type) => !type.startsWith("c-")));
	} else setSelectedLists(types);

	console.log(types, data);
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
