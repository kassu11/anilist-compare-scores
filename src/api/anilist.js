const userQuery = `query($page:Int = 1 $id:Int $search:String $sort:[UserSort]=[SEARCH_MATCH]) {
	Page(page:$page,perPage:20) {
		pageInfo {
			total 
			perPage 
			currentPage 
			lastPage 
			hasNextPage
		} 
		users(id:$id search:$search sort:$sort) {
			id 
			name 
      statistics {
        anime {
          count
          meanScore
          minutesWatched
        }
        manga {
          count
          meanScore
          chaptersRead
        }
      }
			avatar {
        medium
			}
		}
	}
}`;

const userVariable = {
	"page": 1,
	"type": "USERS",
	"search": "user_name",
	"sort": "SEARCH_MATCH"
}

const fetchedUsers = {};

export async function fetchUsers(userName) {
	userName = userName.toLowerCase();
	if (userName === "") return [];
	if (fetchedUsers[userName] instanceof Promise) {
		await fetchedUsers[userName];
		return fetchedUsers[userName];
	}
	if (fetchedUsers[userName]) return fetchedUsers[userName];

	let fetchingDone;
	fetchedUsers[userName] = new Promise((resolve) => fetchingDone = resolve);

	const option = optionHandler(userQuery, { ...userVariable, search: userName });
	const response = await fetch("https://graphql.anilist.co", option);
	const json = await response.json();
	fetchedUsers[userName] = json.data.Page.users;
	fetchingDone();
	return json.data.Page.users;
}

export const optionHandler = (query, variables = {}) => ({
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		"Accept": "application/json",
	},
	body: JSON.stringify({
		query,
		variables
	})
});