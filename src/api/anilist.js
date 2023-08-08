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
			avatar {
				large
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

export async function fetchUsers(search) {
	const option = optionHandler(userQuery, { ...userVariable, search });
	const response = await fetch("https://graphql.anilist.co", option);
	return await response.json();
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