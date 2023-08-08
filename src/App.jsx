import UserSearch from "./Components/UserSearch";

function App() {
  return (
    <>
      <footer>
        <UserSearch />
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Mean score</th>
              <th>Anime</th>
              <th>Hours</th>
              <th>Manga</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>

        <div id="checkboxRow">
          <ul>
            <li><input type="checkbox" name="status" id="Completed" /> <label htmlFor="Completed">Completed</label></li>
            <li><input type="checkbox" name="status" id="Planning" /> <label htmlFor="Planning">Planning</label></li>
            <li><input type="checkbox" name="status" id="Watching" /> <label htmlFor="Watching">Watching</label></li>
            <li><input type="checkbox" name="status" id="Rewatched" /> <label htmlFor="Rewatched">Rewatched</label></li>
            <li><input type="checkbox" name="status" id="Paused" /> <label htmlFor="Paused">Paused</label></li>
            <li><input type="checkbox" name="status" id="Dropped" /> <label htmlFor="Dropped">Dropped</label></li>
            <li><input type="checkbox" name="status" id="Custom" /> <label htmlFor="Custom">Custom</label></li>
          </ul>
        </div>

        <button>Anime</button>
        <button>Manga</button>
      </footer>
      <main></main>
    </>
  );
}

function userSearch() {

}

export default App;