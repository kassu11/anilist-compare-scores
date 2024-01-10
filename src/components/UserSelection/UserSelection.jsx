import { createEffect, useContext } from "solid-js";
import { GlobalContext } from "../../App";

export default function UserSelection() {
	const { users } = useContext(GlobalContext);

	createEffect(() => {
		console.log(users());
	});

	return (
		<For each={users()}>
			{(user) => {
				return <p>{user.name}</p>;
			}}
		</For>
	);
}
