import UserSearch from "./Components/UserSearch";
import UserTable from "./Components/UserTable";
import UserMedia from "./Components/UserMedia";
import MediaTypeButtons from "./Components/MediaTypeButtons";

function App() {
  return (
    <>
      <footer>
        <UserSearch />
        <UserTable />

        <div id="checkboxRow">
          <ul>
            <li><input type="checkbox" name="status" id="Completed" checked /> <label htmlFor="Completed">Completed</label></li>
            <li><input type="checkbox" name="status" id="Planning" checked /> <label htmlFor="Planning">Planning</label></li>
            <li><input type="checkbox" name="status" id="Watching" checked /> <label htmlFor="Watching">Watching</label></li>
            <li><input type="checkbox" name="status" id="Rewatched" checked /> <label htmlFor="Rewatched">Rewatched</label></li>
            <li><input type="checkbox" name="status" id="Paused" checked /> <label htmlFor="Paused">Paused</label></li>
            <li><input type="checkbox" name="status" id="Dropped" checked /> <label htmlFor="Dropped">Dropped</label></li>
            <li><input type="checkbox" name="status" id="Custom" checked /> <label htmlFor="Custom">Custom</label></li>
          </ul>
        </div>

        <MediaTypeButtons />
      </footer>
      <UserMedia />
    </>
  );
}

function userSearch() {

}

export default App;