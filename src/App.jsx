// import UserSearch from "./Components/UserSearch";
import UserTable from "./Components/UserTable/UserTable";
import UserMediaList from "./Components/UserMedia";
import MediaTypeButtons from "./Components/MediaTypeButtons";
import ListTypes from "./Components/ListTypes";
import MediaSort from "./Components/MediaSort";

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
				<UserTable />

				<ListTypes />

				<MediaTypeButtons />
				<MediaSort />
			</footer>
			<UserMediaList />
		</>
	);
}

export default App;
