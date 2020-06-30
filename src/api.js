const BASE_URL = 'https://thinkful-list-api.herokuapp.com/karsten/bookmarks';

// handle errors where an e is not thrown
const bookmarksApiFetch = (...args) => {
  // The rest parameter syntax allows us to represent an indefinite number of arguments as an array.
  let error = null;
  return fetch(...args)
    .then((res) => {
      console.log(`res: ${res}`);
      if (!res.ok) {
        error = { code: res.status }; // define our error
      }
      return res.json(); // regardless if err or not, return res.json()
    })
    .then((data) => {
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }
      console.log(`data: ${data}`);
      return data;
    });
};

const deleteBookmark = (id) => {
  return bookmarksApiFetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const createNewBookmark = (bookmark) => {
  // bookmark will be an object
  const newBookmark = JSON.stringify(bookmark);
  return bookmarksApiFetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: newBookmark,
  });
};

const fetchBookmarks = () => {
  return bookmarksApiFetch(BASE_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export default {
  deleteBookmark,
  createNewBookmark,
  fetchBookmarks,
};
