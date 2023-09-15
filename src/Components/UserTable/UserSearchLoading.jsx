import "../../style/settings.scss";

function UserSearchLoading() {
	const leading = new Array(5).fill(0);
	return (
		<For each={leading}>
			{() => (
				<div class="user">
					<div class="loadingImage"></div>
					<span>Loading...</span>
				</div>
			)}
		</For>
	);
}

export default UserSearchLoading;
