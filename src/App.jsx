import { createContext, createSignal } from "solid-js";
import UserSearch from "./components/UserSearch/userSearch";
import UserSelection from "./components/UserSelection/UserSelection";

export const GlobalContext = createContext();

function App() {
	const [users, setUsers] = createSignal([]);

	return (
		<GlobalContext.Provider value={{ users, setUsers }}>
			<h1>Anime Score Compare</h1>
			<p>
				The interface works, but is not decorated yet! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odio ratione atque
				perferendis facilis eius iste, possimus dicta neque libero, quas sequi minus dolore. Eius dolor cumque, voluptate veritatis maiores
				rerum.
			</p>
			<UserSearch />
			<UserSelection />
		</GlobalContext.Provider>
	);
}

export default App;
