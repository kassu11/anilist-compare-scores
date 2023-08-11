const DEBUG = location.hostname === "localhost"

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
  const debugKey = "ani" + userName + "Search";
  if (DEBUG) {
    const data = JSON.parse(localStorage.getItem(debugKey));
    if (data) return data;
  }
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
  if (DEBUG) localStorage.setItem(debugKey, JSON.stringify(fetchedUsers[userName]));
  fetchingDone();
  return fetchedUsers[userName];
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

export const fetchedUserMedias = {};
const userMediaQuery = `query ($userId: Int, $userName: String, $type: MediaType) {
  MediaListCollection(userId: $userId, userName: $userName, type: $type) {
    lists {
      name
      isCustomList
      isCompletedList: isSplitCompletedList
      entries {
        ...mediaListEntry
      }
    }
    user {
      id
      name
      avatar {
        large
      }
      mediaListOptions {
        scoreFormat
        rowOrder
        animeList {
          sectionOrder
          customLists
          splitCompletedSectionByFormat
          theme
        }
        mangaList {
          sectionOrder
          customLists
          splitCompletedSectionByFormat
          theme
        }
      }
    }
  }
}

fragment mediaListEntry on MediaList {
  id
  mediaId
  status
  score
  progress
  progressVolumes
  repeat
  priority
  private
  hiddenFromStatusLists
  customLists
  advancedScores
  notes
  updatedAt
  startedAt {
    year
    month
    day
  }
  completedAt {
    year
    month
    day
  }
  media {
    id
    title {
      userPreferred
      romaji
      english
      native
    }
    coverImage {
      extraLarge
      large
      color
    }
    season
    type
    format
    status(version: 2)
    episodes
    volumes
    chapters
    averageScore
    popularity
    isAdult
    countryOfOrigin
    genres
    bannerImage
    nextAiringEpisode {
      episode
    }
    startDate {
      year
      month
      day
    }
  }
}`

const userMediaVariable = {
  "userId": 0,
  "type": "ANIME"
}

export async function fetchUserMedia({ id, name }, type = "ANIME") {
  const debugKey = "ani" + id + type;
  if (DEBUG) {
    const data = JSON.parse(localStorage.getItem(debugKey));
    if (data) return data;
  }
  if (name === "") return [];
  const key = name + type;
  if (fetchedUserMedias[key] instanceof Promise) {
    await fetchedUserMedias[key];
    return fetchedUserMedias[key];
  }
  if (fetchedUserMedias[key]) return fetchedUserMedias[key];

  let fetchingDone;
  fetchedUserMedias[key] = new Promise((resolve) => fetchingDone = resolve);

  const option = optionHandler(userMediaQuery, { ...userMediaVariable, userId: id, type });
  const response = await fetch("https://graphql.anilist.co", option);
  const json = await response.json();
  fetchedUserMedias[key] = json.data.MediaListCollection.lists;
  if (DEBUG) localStorage.setItem(debugKey, JSON.stringify(fetchedUserMedias[key]));
  fetchingDone();
  return fetchedUserMedias[key];
}