import { updateMediaData } from "./UserMedia";
import { setSelectedLists, mediaType, userTable, allUserLists, setAllUserLists, userListSelectionMemory } from "../utilities/signals";
import { fetchUserMedia } from "../api/anilist";
import { mergeProps, splitProps } from "solid-js";

const custom = (list) => list.startsWith("c-");
const notCustom = (list) => !list.startsWith("c-");
const memory = (scope, listName) => userListSelectionMemory[mediaType()][scope]?.[listName];
const setMemory = (scope, listName, value) => {
	userListSelectionMemory[mediaType()][scope] ??= {};
	userListSelectionMemory[mediaType()][scope][listName] = value;
};

const defaultScope = "global";

function ListTypes() {
	return (
		<form id="checkboxRow" onInput={(e) => updateListType(e.currentTarget)}>
			<p>All user lists</p>
			<SelectionList list={allUserLists()} scope={defaultScope} />
		</form>
	);
}

export function SelectionList(props) {
	const merged = mergeProps({ list: [], scope: defaultScope, disabled: false }, props);

	return (
		<ul>
			<For each={merged.list.filter(notCustom)}>
				{(item) => (
					<Show when={item === "Custom"} fallback={<ListItem id={item} checked={true} {...merged} />}>
						<CustomList {...merged} />
					</Show>
				)}
			</For>
		</ul>
	);
}

const CustomList = (props) => {
	const [local, others] = splitProps(props, ["list"]);
	const open = memory(others.scope, "dropdown");
	const setOpen = (value) => setMemory(others.scope, "dropdown", value);

	return (
		<li>
			<details class="custom-list-dropdown" open={open} onToggle={(e) => setOpen(e.target.open)}>
				<summary>
					<ListValues id="Custom" checked={true} {...others} />
					<span class="dropdown-lable">[more]</span>
				</summary>
				<ul>
					<For each={local.list.filter(custom)}>{(item) => <ListItem id={item} {...others} />}</For>
				</ul>
			</details>
		</li>
	);
};

const ListItem = (props) => (
	<li>
		<ListValues {...props} />
	</li>
);

const ListValues = (props) => {
	const merged = mergeProps({ checked: false }, props);
	return (
		<>
			<input
				type="checkbox"
				name={merged.id}
				id={merged.scope + merged.id}
				checked={memory(merged.scope, merged.id) ?? merged.checked}
				onInput={(e) => setMemory(merged.scope, e.target.name, e.target.checked)}
				disabled={merged.disabled}
			/>
			<label htmlFor={merged.scope + merged.id}>{merged.id.replace("c-", "")}</label>
		</>
	);
};

export function updateListType(formElem) {
	const data = Object.fromEntries(new FormData(formElem));
	const globalSettings = userListSelectionMemory[mediaType()][defaultScope];
	allUserLists().forEach((list) => (globalSettings[list] = list in data));
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
