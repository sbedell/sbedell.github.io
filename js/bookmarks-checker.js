const fileInput = document.getElementById("file-input");
const fileContentDisplay = document.getElementById("file-content");

// Add an event listener to the file input
fileInput.addEventListener("change", function(event) {
  // Get the first file from the selection
  const file = event.target.files[0];

  if (file) {
    // here you get: name, type, lastModified, and size.
    console.log("file info: ", file);

    const reader = new FileReader();

    reader.onload = function(e) {
      // Set the text content of the <pre> tag to the file's result
      let fileContent = e.target.result;
      // fileContentDisplay.textContent = fileContent;

      if (file.type === 'application/json') {
        try {
          const bookmarksJson = JSON.parse(fileContent);

          // fileContentDisplay.textContent = JSON.stringify(bookmarksJson, null, 2);

          console.log("Successfully parsed JSON object:", bookmarksJson);

          let parsedBookmarks = parseBookmarks(bookmarksJson);
          // TODO - Here you'll want to handle this way better. Maybe use Vue?
          // fileContentDisplay.textContent = JSON.stringify(parsedBookmarks);
        } catch (error) {
          fileContentDisplay.textContent = "Error parsing JSON file: " + error.message;
          console.error("Parsing error: ", error);
        }
      }
    };

    reader.onerror = function(e) {
      console.error("Error reading file: ", e.target.error);
      fileContentDisplay.textContent = "Error reading file.";
    };

    reader.readAsText(file);
  }
});

/* ****** Helper Functions ******** */

function checkBookmarkForIssues(bookmark, folderName) {
  let bookmarkWithInfo = {
    url: bookmark.uri,
    title: bookmark.title,
    folder: folderName
  };

  if (bookmark.uri && bookmark.uri.match(/^http:\/\//)) {
    // Add the error flag here as Insecure / HTTP
    bookmarkWithInfo.error = "Insecure / HTTP";
    console.log(bookmarkWithInfo);
  } else if (bookmark.uri && bookmark.uri.match(/^https:\/\//)) {
    // checkBookmarkHttpsRequest(bookmark.uri, bookmark.title, folderName);
  } else if (bookmark.uri && bookmark.uri.match(/^javascript:/)) {
    // Return here, don't need to do an HTTP request for bookmarklets
    return bookmarkWithInfo;
  }

  fetchBookmark(bookmark.uri, bookmark.title, folderName);

  return bookmarkWithInfo;
}

function fetchBookmark(bookmarkURL, urlTitle="", folderName="") {
  const options = {
    // This is in milliseconds. 5 second timeout.
    signal: AbortSignal.timeout(5000)
  };

  console.log('attempting to fetch: ', bookmarkURL)

  const statusCodesToCheck = [400, 401, 404]

  // fetch(bookmarkURL, options)
  //   .then(response => {
  //     if (response.ok) {
  //       return response.text();
  //     } else {
  //       // idk Return a Promise.reject ?
  //     }
  //   }).then(responseText => {
  //     console.log('responseText: ', responseText);
  //   }).catch(error => {
  //     console.error("[!] Error: ", error);
  //   });

  //   if (statusCodesToCheck.includes(response.statusCode)) {
  //     console.log(`${httpsURL.substring(0, 100)},${urlTitle.replace(/,/g, " ").substring(0, 80)},${folderName},${response.statusCode}`);
  //   }
  // }).on('error', e => {
  //   console.log(`Error checking ${httpsURL.substring(0, 100)},${urlTitle.replace(/,/g, " ").substring(0, 80)},${folderName},${e}`);
  // });
}

function parseBookmarks(bookmarks) {
  let myBookmarks = {};

  // children[0] is the Bookmarks Menu folder, the children of that is each folder.
  let bookmarksFolders = bookmarks.children[0].children;

  for (let bookmarksFolder of bookmarksFolders) {
    // Here it is...the actual bookmarks, except when there are subfolders.
    let bookmarks = bookmarksFolder.children;
    if (bookmarks) {
      for (let bookmark of bookmarks) {
        let bookmarkInfo = {};

        // Check for Subfolders:
        if (bookmark.children) {
          for (let childBookmark of bookmark.children) {
            // console.log('childBookmark: ', childBookmark);
            // Extra indentation for more subfolders? / or do recursion?
            if (childBookmark.uri) {
              bookmarkInfo = checkBookmarkForIssues(childBookmark, bookmark.title);
            } else {
              continue;
            }
          }
        } else {
          // console.log("Bookmark: ", bookmark);
          if (bookmark.uri) {
            bookmarkInfo = checkBookmarkForIssues(bookmark, bookmarksFolder.title);
          } else {
            continue;
          }
        }

        if (myBookmarks.hasOwnProperty(bookmarkInfo?.url)) {
          console.log("potential dupe: ", bookmarkInfo);
          // bookmarkInfo.dupe = true;
        } else {
          myBookmarks[bookmarkInfo.url] = bookmarkInfo;
        }
      }
    }
  }

  return myBookmarks;
}