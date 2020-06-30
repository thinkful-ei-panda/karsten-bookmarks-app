import store from './store.js';
import api from './api.js';

//  HTML STRING
const generateButtonsBar = () => {
  return `<section class="main-buttons">
    
    <div class="btn main-btn add-new js-add-new"><i class="fas fa-plus"></i> <span class="new-text">New</span> <i class="hidden bookmark-icon far fa-bookmark"></i></div>
    <div class="btn main-btn filter-btn"><span>Filter By</span> 
        <select name="rating" id="rating-filter">
            <option value="0">--</option>
            <option ${store.filter == 1 ? 'selected' : ''} value="1">1</option>
            <option ${store.filter == 2 ? 'selected' : ''} value="2">2</option>
            <option ${store.filter == 3 ? 'selected' : ''} value="3">3</option>
            <option ${store.filter == 4 ? 'selected' : ''} value="4">4</option>
            <option ${store.filter == 5 ? 'selected' : ''} value="5">5</option>
        </select>
    </div>

</section>`;
};

function generateBookmark(bookmark) {
  let rating = bookmark.rating
    ? `<span class="rating-expanded">${bookmark.rating}</span>`
    : '';

  let expandedSection = bookmark.expanded
    ? `<div class="main-section hidden">
    <div class="button-rating">
        <a class="visit-site" target="_blank" href="${bookmark.url}">Visit Site</a>
        ${rating}
    </div>

    <p class="bookmark-desc">
        ${bookmark.desc}
    </p>

    <div class="button-delete hidden-large js-delete-bookmark">Delete</div> 
</div>`
    : '';

  const generateRating = () => {
    let htmlString = '';
    for (let i = 1; i <= bookmark.rating; i++) {
      htmlString += `<i class="star-icon fas fa-star"></i>`;
    }
    return htmlString;
  };

  let icon = bookmark.expanded
    ? `<i class="trash-icon js-delete-bookmark fas fa-trash-alt"></i>`
    : `${generateRating()}`;

  return `<li class="js-bookmark-element" data-item-id="${bookmark.id}">
        <div class="title-section">
            <h2>${bookmark.title}</h2>
            <div class="bar-icon">${icon}</div>
        </div>
        ${expandedSection}
        </li>`;
}

const generateBookmarksSection = () => {
  if ($('#rating-filter').val() === 'default') {
    return `<ul>
        ${store.bookmarks
          .map((bookmark) => generateBookmark(bookmark))
          .join('')}
    </ul>`;
  } else {
    return `<ul>
                ${store.bookmarks
                  .filter((bookmark) => bookmark.rating >= store.filter)
                  .map((bookmark) => generateBookmark(bookmark))
                  .join('')}
            </ul>`;
  }
};

function generateNewBookmarkForm() {
  let errorBox = store.error
    ? `<div class="error-box"><em class="error-msg">${store.error}</em></div>`
    : '';
  return `
    ${errorBox}
    <form class="add-new-form" method="POST">
    <fieldset>
        <legend>Add New Bookmark</legend>

        <div class="field">
        <label for="add-url">Link: <span class="required-span"><em>Required</em></span></label>
        <input required placeholder="Must begin with 'http://' or 'https://'" id="add-url" type="url">
        </div>

        <div class="field">
        <label for="add-title">Title: <span class="required-span"><em>Required</em></span></label>
        <input required placeholder="Title" id="add-title" type="text">
        </div>


        <div class="field">
        <label for="add-desc">Description:</label>
        <textarea name="add-desc" id="add-desc" cols="30" rows="10" placeholder="Add Description (optional)"></textarea>
        </div>

        <div class="field">
        <label for="add-rating">Rating:</label>
        <select name="add-rating" id="add-rating">
            <option value="none">--</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>
        </div>

        <div class="form-buttons">
            <button class="btn cancel-btn js-cancel-btn">Cancel</button>
            <button class="btn submit-btn" type="submit">Submit</button>
        </div>

    </fieldset>
</form>`;
}

// EVENT HANDLERS
const handleAddNewClicked = function () {
  $('main').on('click', '.js-add-new', (e) => {
    store.toggleAdding();
    render();
  });
};

const handleDeleteItemClicked = function () {
  $('main').on('click', '.js-delete-bookmark', (e) => {
    const id = getItemIdFromElement(e.currentTarget);
    api
      .deleteBookmark(id)
      .then(() => {
        store.findAndDelete(id);
        render();
      })
      .catch((e) => {
        console.log('There was an error deleting item!');
      });
  });
};

const handleFilterChange = function () {
  $('main').on('change', '#rating-filter', (e) => {
    const rating = e.currentTarget.value;
    store.filterBookmarksByRating(rating);
    render();
  });
};

const handleNewFormSubmit = function () {
  $('main').on('submit', '.add-new-form', (e) => {
    e.preventDefault();
    const newUrl = $('#add-url').val();
    const newTitle = $('#add-title').val();
    const newDesc = $('#add-desc').val();
    const newRating = $('#add-rating').val();
    let newBookmark = {
      title: newTitle,
      url: newUrl,
      desc: newDesc,
      expanded: false,
    };

    let obj = {
      rating: newRating,
    };

    if (newRating !== 'none') {
      Object.assign(newBookmark, obj);
    }

    api
      .createNewBookmark(newBookmark)
      .then((bookmark) => {
        store.addBookmark(bookmark);
        store.toggleAdding();
        render();
      })
      .catch((e) => {
        console.log(e);
        store.setError(e.message);
        render();
      });
  });
};

// handle expanded clicked
const handleExpandedClicked = function () {
  $('main').on('click', '.title-section', (e) => {
    const id = getItemIdFromElement(e.currentTarget);
    store.toggleExpanded(id);
    render();
  });
};

const handleCancelClicked = function () {
  $('main').on('click', '.js-cancel-btn', (e) => {
    store.toggleAdding();
    render();
  });
};

const bindEventListeners = () => {
  handleAddNewClicked();
  handleDeleteItemClicked();
  handleFilterChange();
  handleNewFormSubmit();
  handleExpandedClicked();
  handleCancelClicked();
};

// OTHER
const getItemIdFromElement = function (item) {
  return $(item).closest('.js-bookmark-element').data('item-id');
};

const start = function () {
  bindEventListeners();
  api.fetchBookmarks().then((bookmarks) => {
    store.setBookmarks(bookmarks);
    render();
  });
};

// RENDER
const render = () => {
  let html = '';
  if (!store.adding) {
    // if we are not adding a bookmark...
    html += generateButtonsBar();
    html += generateBookmarksSection();
  } else {
    html += generateNewBookmarkForm();
  }
  $('main').html(html);
};

export default {
  start,
};
