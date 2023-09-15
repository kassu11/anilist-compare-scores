import { setSearchIndex } from "../../utilities/signals";
import { submitSearch } from "./UserSearch2";

import "../../style/settings.scss";

function UserSearchItem({ user, selected, index }) {
	return (
		<div custom-selected={selected ? "" : null} class="user" onClick={userClick} onMouseMove={userMove}>
			<img src={user.avatar.medium} class="loading" onLoad={removeLoading} />
			<span class="userName">{user.name}</span>
		</div>
	);

	function userClick() {
		setSearchIndex(index);
		submitSearch();
		document.querySelector("#userSearch input").focus();
	}

	function userMove(event) {
		if (event.target.hasAttribute("custom-selected")) return;

		const users = document.querySelectorAll(`.user[custom-selected]`);
		users.forEach((user) => user.removeAttribute("custom-selected"));
		event.target.setAttribute("custom-selected", "");
	}
}

function removeLoading(event) {
	event.target.classList.remove("loading");
}

export default UserSearchItem;
