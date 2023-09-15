import "../../style/settings.scss";

function UserSearchLoading() {
	const leading = new Array(5).fill(0);
	return (
		<For each={leading}>
			{() => (
				<div class="search-user-item">
					<div class="user-search-fetching-image"></div>
					<span>Loading...</span>
				</div>
			)}
		</For>
	);
}

export default UserSearchLoading;
