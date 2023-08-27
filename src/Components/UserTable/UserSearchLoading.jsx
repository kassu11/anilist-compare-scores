import style from "./UserSearch2.module.css";

function UserSearchLoading() {
	const leading = new Array(5).fill(0);
	return (
		<For each={leading}>{() => (
			<div className={style.user}>
				<div className={style.loadingImage}></div>
				<span className={style.loadingName}>Loading...</span>
			</div>
		)}</For>
	);
}

export default UserSearchLoading;