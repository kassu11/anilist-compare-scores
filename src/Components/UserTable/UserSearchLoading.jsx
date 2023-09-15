import itemStyle from "./UserSearchItem.module.css";
import loadingStyle from "./UserSearchLoading.module.css";

function UserSearchLoading() {
	const leading = new Array(5).fill(0);
	return (
		<For each={leading}>{() => (
			<div className={itemStyle.user}>
				<div className={loadingStyle.loadingImage}></div>
				<span>Loading...</span>
			</div>
		)}</For>
	);
}

export default UserSearchLoading;