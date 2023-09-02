import UserSearch from "./Components/UserSearch";
import UserTable from "./Components/UserTable/UserTable";
import UserMediaList from "./Components/UserMedia";
import MediaTypeButtons from "./Components/MediaTypeButtons";
import ListTypes from "./Components/ListTypes";

import WebWorker from "./lib/test.js?worker";

const myWorker = WebWorker instanceof Worker ? WebWorker : new WebWorker();

myWorker.postMessage([{ 5: 5 }, 7]);

function App() {
	return (
		<>
			<footer class="settings">
				<h1>Anime Score Compare</h1>
				{/* <UserSearch /> */}
				<UserTable />

				<ListTypes />

				<MediaTypeButtons />
			</footer>
			<UserMediaList />
		</>
	);
}

function userSearch() {}

export default App;
