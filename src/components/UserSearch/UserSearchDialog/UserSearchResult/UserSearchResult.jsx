import style from "./UserSearchResult.module.scss";

export default function UserSearchResult(props) {
	return (
		<div className={style["search-results"]}>
			<For each={props.recommendations}>
				{(user, index) => {
					return (
						<div
							className={style["user-row"]}
							classList={{ selected: props.isSelected(index()) }}
							onMouseEnter={() => props.setSearchIndex(index())}
							onClick={props.submitSearch}
						>
							<img src={user.avatar.medium} />
							<span>{user.name}</span>
						</div>
					);
				}}
			</For>
		</div>
	);
}
