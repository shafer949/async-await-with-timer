/* ===========================
 function to have a timeout and reject a promise
=========================== */

// have a function that returns a promise
const awaitTimeout = (url, timeout = 1000) => {
  // variable for holding timeout object to clear out when successful request
  let timeoutHolder;
  return new Promise((resolve, reject) => {
    // Setup a timeout that will trigger "reject" after given time
    timeoutHolder = setTimeout(() => {
      // Setup a timeout that will trigger "reject" after given time
      reject("API Request took too long");
    }, timeout);
    // do a fetch. This will eventually resolve itself
    fetch(url).then(resp => {
      // if response is okay, get the JSON body
      if (resp.ok) {
        // get the json promise from the response.
        resp.json().then(value => {
          // clear out the timer so it doesn't trigger anymore
          clearTimeout(timeoutHolder);
          resolve(value);
        });
      } else {
        switch (resp.status) {
          case 404:
            reject("404 API not found");
            break;
          case 500:
            reject("500 Server Error");
            break;
          default:
            reject("Erroor in API Request");
            break;
        }
      }
    });
  });
};

const loadData = async () => {
  try {
    // 41 ms seemed to fluctuate between success or fail
    const url = "https://jsonplaceholder.typicode.com/users";
    const users = await awaitTimeout(url, 41);
    console.log(users);
  } catch (e) {
    console.log("Error: ", e);
  }
};

loadData();
