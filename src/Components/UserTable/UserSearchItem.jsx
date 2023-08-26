import { setSearchIndex } from "../../utilities/signals";
import { submitSearch } from "./UserSearch2";

import style from "./UserSearch2.module.css";

function UserSearchItem({ user, selected, index }) {
	return (
		<div custom-selected={selected ? "" : null} className={style.user} onClick={userClick} onMouseMove={userMove}>
			<img src={user.avatar.medium} className={style.loading} onLoad={removeLoading} />
			<span>{user.name}</span>
		</div>
	);

	function userClick() {
		setSearchIndex(index);
		submitSearch();
		document.querySelector("#userSearch input").focus();
	}

	function userMove(event) {
		if (event.target.hasAttribute("custom-selected")) return;

		const users = document.querySelectorAll(`.${style.user}[custom-selected]`);
		users.forEach(user => user.removeAttribute("custom-selected"));
		event.target.setAttribute("custom-selected", "");
	}

}

function removeLoading(event) {
	event.target.classList.remove(style.loading);
}

export default UserSearchItem;