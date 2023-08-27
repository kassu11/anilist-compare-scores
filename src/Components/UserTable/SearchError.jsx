import { createEffect } from "solid-js";
import style from "./SearchError.module.css";

let timeOut;

function SearchError({ error }) {
	const elem = (
		<dialog className={style.error}>
			<form method="dialog" className={style.container}>
				<p>{error()}</p>
				<button className={style.closeButton} onClick={() => clearInterval(timeOut)} type="close" />
			</form>
		</dialog>
	);

	createEffect(() => {
		if (error()) {
			elem.show();
			document.querySelector("#userSearch input").select();
			timeOut = setTimeout(() => elem.close(), 2500);
		} else {
			elem.close();
			clearInterval(timeOut);
		}
	});

	return elem;
}

export default SearchError;