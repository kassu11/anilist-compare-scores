import UserSearchDialog from "./UserSearchDialog/UserSearchDialog";
import { createSignal } from "solid-js";

import style from "./userSearch.module.scss";

export default function userSearch() {
	const [open, setOpen] = createSignal(false);

	return (
		<>
			<button onClick={() => setOpen((s) => !s)}>Search User</button>
			<UserSearchDialog open={open()} setOpen={setOpen} />
		</>
	);
}
