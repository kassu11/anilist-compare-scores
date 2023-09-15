import { createEffect } from "solid-js";
import "../../style/settings.scss";

let timeOut;

function SearchError({ error }) {
	const elem = (
		<dialog class="error">
			<form method="dialog" class="error-container">
				<p>{error()}</p>
				<button class="error-close-button" onClick={() => clearInterval(timeOut)} type="close" />
			</form>
		</dialog>
	);

	createEffect(() => {
		if (error()) {
			elem.show();
			userSearchDialog?.querySelector("input").select();
			timeOut = setTimeout(() => elem.close(), 2500);
		} else {
			elem.close();
			clearInterval(timeOut);
		}
	});

	return elem;
}

export default SearchError;
