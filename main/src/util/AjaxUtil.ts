const asyncFetchGet = <T,>(url: string,
  successCallback: (json: T) => void,
  failureCallback: (error: Error) => void) => {
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(response => response.json())
    .then(data => successCallback(data))
    .catch(error => failureCallback(error));
};

export { asyncFetchGet };
