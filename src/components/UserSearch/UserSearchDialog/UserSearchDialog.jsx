import { batch, createEffect, createResource, createSelector, createSignal } from "solid-js";
import { fetchUsers } from "../../../api/anilist";
import style from "./UserSearchDialog.module.scss";
import UserSearchResult from "./UserSearchResult/UserSearchResult";
import SearchForm from "./SearchForm/SearchForm";

export default function UserSearchDialog(props) {
	const [searchIndex, setSearchIndex] = createSignal(0);
	const [search, setSearch] = createSignal("");
	const [recommendations] = createResource(search, fetchUsers);
	const isSelected = createSelector(searchIndex);

	const closeOnFocusOut = (event) => {
		if (event.target === dialogElem) props.setOpen(false);
	};

	const submitSearch = async (event) => {
		event?.preventDefault?.();
		const userName = search();
		const index = searchIndex();
		dialogElem.querySelector("input").focus();

		batch(() => {
			setSearch("");
			setSearchIndex(0);
		});

		if (!userName) return console.log("No input");

		const searchResponse = await fetchUsers(userName);
		const newUser = searchResponse[index];

		if (!newUser?.name) return console.log("No users found");

		console.table(newUser);
	};

	const onKeyDown = (event) => {
		const { code } = event;

		if ((code === "Enter" && !search()) || code === "Escape") {
			dialogElem.close();
			setSearchIndex(0);
			return setSearch("");
		} else if (code === "ArrowUp" || (code === "Tab" && event.shiftKey)) {
			event.preventDefault();
			setSearchIndex((i) => (i - 1 < 0 ? recommendations().length - 1 : i - 1));
			const user = dialogElem?.querySelector(".selected");
			if (!user) return;
			user?.scrollIntoView({ block: "nearest" });
		} else if (code === "ArrowDown" || code === "Tab") {
			event.preventDefault();
			setSearchIndex((i) => (i + 1 >= recommendations().length ? 0 : i + 1));
			const user = dialogElem?.querySelector(".selected");
			if (!user) return;
			user?.scrollIntoView({ block: "nearest" });
		}
	};

	const dialogElem = (
		<dialog onClose={() => props.setOpen(false)} className={style["user-search-dialog"]} onClick={closeOnFocusOut}>
			<div className={style["dialog-container"]}>
				<SearchForm onKeyDown={onKeyDown} search={search()} setSearch={setSearch} submitSearch={submitSearch} />
				<UserSearchResult
					recommendations={recommendations()}
					isSelected={isSelected}
					setSearchIndex={setSearchIndex}
					submitSearch={submitSearch}
				/>
			</div>
		</dialog>
	);

	createEffect(() => {
		if (props.open) dialogElem.showModal();
		else dialogElem.close();
	});

	createEffect(() => {
		if (recommendations()) setSearchIndex(0);
	});

	return dialogElem;
}
