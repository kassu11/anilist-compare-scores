import { setSearchIndex } from "../../utilities/signals";
import { submitSearch } from "./UserSearch2";

import "../../style/settings.scss";

function UserSearchItem({ user, selected, index }) {
	return (
		<div custom-selected={selected ? "" : null} class="search-user-item" onClick={userClick} onMouseMove={userMove}>
			<img src={user.avatar.medium} class="user-search-img-src-loading" onLoad={removeLoading} />
			<span>{user.name}</span>
		</div>
	);

	function userClick() {
		setSearchIndex(index);
		submitSearch();
		userSearchDialog.querySelector("input").focus();
	}

	function userMove(event) {
		if (event.target.hasAttribute("custom-selected")) return;

		const users = userSearchDialog.querySelectorAll("[custom-selected]");
		users.forEach((user) => user.removeAttribute("custom-selected"));
		event.target.setAttribute("custom-selected", "");
	}
}

function removeLoading(event) {
	event.target.classList.remove("user-search-img-src-loading");
}

export default UserSearchItem;
