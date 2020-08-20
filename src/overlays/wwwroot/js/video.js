
// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

// (optional) add server code here
initializeSession();

function initializeSession() {

  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.has('session') ? urlParams.get('session') : ''

  fetch(`/vonage/join/${sessionId}`)
    .then(response => response.json())
    .then(({ apiKey, sessionId, token }) => {

      const session = OT.initSession(apiKey, sessionId);

      // Create a publisher
      const publisher = OT.initPublisher('publisher', {
        insertMode: 'append',
        width: '100%',
        height: '100%'
      }, handleError);

      // Connect to the session
      session.connect(token, function (error) {
        // If the connection is successful, initialize a publisher and publish to the session
        if (error) {
          handleError(error);
        } else {
          session.publish(publisher, handleError);
        }
      });
    })
}
