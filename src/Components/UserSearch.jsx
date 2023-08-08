import { fetchUsers } from "../api/anilist";
import { createSignal, createResource } from "solid-js";


function UserSearch() {
	const [search, setSearch] = createSignal();
	const [data] = createResource(search, fetchUsers);

	return (
		<nav>
			<form onSubmit={test} onInput={e => setSearch(e.target.value)}>
				<ul>
					<li><input type="text" /></li>
					<li><input type="radio" name="mode" id="All" /><label htmlFor="All">All</label></li>
					<li><input type="radio" name="mode" id="Intersect" /><label htmlFor="Intersect">Intersect</label></li>
					<li><input type="radio" name="mode" id="Exclude" /><label htmlFor="Exclude">Exclude</label></li>
				</ul>
			</form>
			{console.log(data())}
		</nav>
	)
}

function test(e) {
	e.preventDefault();
	console.log(e);
}


export default UserSearch;