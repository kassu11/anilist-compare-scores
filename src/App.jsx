// import UserSearch from "./Components/UserSearch";
import UserTable from "./Components/UserTable/UserTable";
import UserMediaList from "./Components/UserMedia";
import MediaTypeButtons from "./Components/MediaTypeButtons";
import ListTypes from "./Components/ListTypes";
import MediaSort from "./Components/MediaSort";

import WebWorker from "./lib/test.js?worker";

const myWorker = WebWorker instanceof Worker ? WebWorker : new WebWorker();

myWorker.postMessage([{ 5: 5 }, 7]);

function App() {
	return (
		<>
			<footer class="settings">
				<h1>Anime Score Compare</h1>
				<p>
					The interface works, but is not decorated yet! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odio ratione atque
					perferendis facilis eius iste, possimus dicta neque libero, quas sequi minus dolore. Eius dolor cumque, voluptate veritatis
					maiores rerum.
				</p>
				{/* <UserSearch /> */}
				<UserTable />

				<ListTypes />

				<MediaTypeButtons />
				<MediaSort />
			</footer>
			<UserMediaList />
		</>
	);
}

function userSearch() {}

export default App;
