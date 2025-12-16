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
          fileContentDisplay.textContent = JSON.stringify(parsedBookmarks);
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
  } else {
    fileContentDisplay.textContent = "No file selected.";
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
  }

  return bookmarkWithInfo;
}

function checkBookmarkHttpsRequest(httpsURL, urlTitle="", folderName="") {
  const options = {
    // timeout: 2000 // This is in milliseconds. 2 second timeout.
    signal: AbortSignal.timeout(2000)
  };

  const statusCodesToCheck = [400, 401, 404]

  fetch(httpsURL, options)
  .then(response => {
    if (response.ok) {
      return response.text();
    } else {
      // idk Returna Promise.reject
    }
  }).then(responseText => {
  }).catch(error => {
    console.error("[!] Error: ", error);
  });

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
            // Extra indentation for more subfolders?
            //bookmark.children.forEach(childBookmark => {
              // console.log("Child bookmark: ", childBookmark.title);
            bookmarkInfo = checkBookmarkForIssues(childBookmark, bookmark.title);
            //});
          }
        } else {
          // console.log("Bookmark: ", bookmark.title);
          bookmarkInfo = checkBookmarkForIssues(bookmark, bookmarksFolder.title);
        }

        if (myBookmarks.hasOwnProperty(bookmarkInfo?.url)) {
          // dupe detected?
          console.log("potential dupe: ", bookmarkInfo);
        } else {
          myBookmarks[bookmarkInfo.url] = bookmarkInfo;
        }
      }
    }
  }

  return myBookmarks;
}