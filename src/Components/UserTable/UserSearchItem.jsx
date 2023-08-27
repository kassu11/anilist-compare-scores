import { setSearchIndex } from "../../utilities/signals";
import { submitSearch } from "./UserSearch2";

import itemStyle from "./UserSearchItem.module.css";

function UserSearchItem({ user, selected, index }) {
	return (
		<div custom-selected={selected ? "" : null} className={itemStyle.user} onClick={userClick} onMouseMove={userMove}>
			<img src={user.avatar.medium} className={itemStyle.loading} onLoad={removeLoading} />
			<span className={itemStyle.userName}>{user.name}</span>
		</div>
	);

	function userClick() {
		setSearchIndex(index);
		submitSearch();
		document.querySelector("#userSearch input").focus();
	}

	function userMove(event) {
		if (event.target.hasAttribute("custom-selected")) return;

		const users = document.querySelectorAll(`.${itemStyle.user}[custom-selected]`);
		users.forEach(user => user.removeAttribute("custom-selected"));
		event.target.setAttribute("custom-selected", "");
	}

}

function removeLoading(event) {
	event.target.classList.remove(itemStyle.loading);
}

export default UserSearchItem;