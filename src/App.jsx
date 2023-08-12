import UserSearch from "./Components/UserSearch";
import UserTable from "./Components/UserTable";
import UserMedia from "./Components/UserMedia";
import MediaTypeButtons from "./Components/MediaTypeButtons";
import ListTypes from "./Components/ListTypes";

function App() {
  return (
    <>
      <footer>
        <UserSearch />
        <UserTable />

        <ListTypes />

        <MediaTypeButtons />
      </footer>
      <UserMedia />
    </>
  );
}

function userSearch() {

}

export default App;