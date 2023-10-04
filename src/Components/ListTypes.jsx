import { updateMediaData } from "./UserMedia";
import { setListType, mediaType, animeUserList, mangaUserList } from "../utilities/signals";

function ListTypes() {
	const custom = (list) => list.startsWith("c-");
	const notCustom = (list) => !list.startsWith("c-");
	return (
		<form id="checkboxRow" onInput={(e) => updateListType(e.currentTarget)}>
			<ul>
				<For each={(mediaType() === "ANIME" ? animeUserList() : mangaUserList()).filter(notCustom)}>
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
										<For each={(mediaType() === "ANIME" ? animeUserList() : mangaUserList()).filter(custom)}>
											{(item) => (
												<li>
													<input type="checkbox" name={item} id={item} />
													<label htmlFor={item}>{item.replace("c-", "")}</label>
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

	if (types.includes("Custom")) {
		setListType(types.filter((type) => !type.startsWith("c-")));
	} else setListType(types);
	updateMediaData();
}

export default ListTypes;
