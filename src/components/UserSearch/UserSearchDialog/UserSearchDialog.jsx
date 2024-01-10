import { batch, createEffect, createResource, createSelector, createSignal } from "solid-js";
import MagnificationGlassSvg from "../../../svg/MagnificationGlassSvg/MagnificationGlassSvg";
import style from "./UserSearchDialog.module.scss";
import { fetchUsers } from "../../../api/anilist";

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
				<form onSubmit={submitSearch}>
					<label className={style["search-container"]}>
						<MagnificationGlassSvg className={style["magnification-glass"]} width={18} height={18} />
						<input
							className={style["user-search-input"]}
							type="search"
							autoComplete="off"
							autoCapitalize="off"
							autoCorrect="off"
							spellCheck="false"
							placeholder="Type to search"
							value={search()}
							onInput={(event) => setSearch(event.target.value)}
							onKeyDown={onKeyDown}
						/>
					</label>
				</form>
				<div className="search-results">
					<For each={recommendations()}>
						{(user, index) => {
							return (
								<div
									className={style["user-row"]}
									classList={{ selected: isSelected(index()) }}
									onMouseEnter={() => setSearchIndex(index())}
									onClick={submitSearch}
								>
									<img src={user.avatar.medium} />
									<span>{user.name}</span>
								</div>
							);
						}}
					</For>
				</div>
			</div>
		</dialog>
	);

	createEffect(() => {
		if (props.open) dialogElem.showModal();
		else dialogElem.close();
	});

	return dialogElem;
}
