import MagnificationGlassSvg from "../../../../svg/MagnificationGlassSvg/MagnificationGlassSvg";
import style from "./SearchForm.module.scss";

export default function SearchForm(props) {
	return (
		<form onSubmit={props.submitSearch}>
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
					value={props.search}
					onInput={(event) => props.setSearch(event.target.value)}
					onKeyDown={props.onKeyDown}
				/>
			</label>
		</form>
	);
}
