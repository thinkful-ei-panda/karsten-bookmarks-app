export default {
  bookmarks: [],
  adding: false,
  error: null,
  filter: 0,
  findAndDelete: function (id) {
    this.bookmarks = this.bookmarks.filter((bookmark) => bookmark.id !== id);
  },
  addBookmark: function (bookmark) {
    console.log(`Adding bookmark to store...`);
    this.bookmarks.push(bookmark);
  },
  filterBookmarksByRating: function (rating) {
    this.filter = rating;
  },
  toggleAdding: function () {
    this.adding = !this.adding;
  },
  toggleExpanded: function (id) {
    const bookmark = this.bookmarks.find((bookmark) => bookmark.id === id);
    bookmark.expanded = !bookmark.expanded;
  },
  setBookmarks: function (bookmarks) {
    this.bookmarks = bookmarks;
  },
  setError(msg) {
    this.error = msg;
  },
};
