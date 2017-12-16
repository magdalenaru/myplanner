  // Client ID and API key from the Developer Console
      var CLIENT_ID = '428606272679-irhs7v69dclkc7rvtea53vbuu83ktf3s.apps.googleusercontent.com';
      var API_KEY = 'AIzaSyA4vCXHm_IOsyOOq7tn-yqYLGjx6x-ePgo';

      // Array of API discovery doc URLs for APIs used by the quickstart
      var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      var SCOPES = "https://www.googleapis.com/auth/calendar";

      var authorizeButton = document.getElementById('authorize-button');
      var signoutButton = document.getElementById('signout-button');

      /**
       *  On load, called to load the auth2 library and API client library.
       */
      function handleClientLoad() {
        gapi.load('client:auth2', initClient);
      }

      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
      function initClient() {
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
        });
      }

      /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
          //listUpcomingEvents();
          listCalendars();
          listEvents();
          createEvent();
        } else {
          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
        }
      }

      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
      }

      /**
       *  Sign out the user upon button click.
       */
      function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node. Used to display the results of the API call.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }

      /**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       */
      function listUpcomingEvents() {
        gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 5,
          'orderBy': 'startTime'
        }).then(function(response) {
          var events = response.result.items;
          appendPre('Upcoming events:');

          if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
              var event = events[i];
              var when = event.start.dateTime;
              if (!when) {
                when = event.start.date;
              }
              appendPre(event.summary + ' (' + when + ')')
            }
          } else {
            appendPre('No upcoming events found.');
          }
        });
      }


//list calendars in console
    function listCalendars(){
        let request = gapi.client.calendar.calendarList.list();

        request.execute(function(resp){
            let calendars = resp.items;
        });
}

//list events in console & in every day
    function listEvents(){

        var today = new Date();
        console.log(today);
        var tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
        console.log(tomorrow);

        let request = gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'timeMax': tomorrow.toISOString(),
            'maxResults': 10,
            'singleEvents': true,
            'orderBy': 'startTime'
        });
        request.execute(function(resp){
            let todayEvents = resp.items;
            console.log(todayEvents);
            // let today = document.getElementsByClassName('events_day');
            // console.log(today);

            todayEvents.forEach(function(element) {
                let newLi = document.createElement("LI");
                console.log(newLi);
                
                let when = new Date(element.start.dateTime);
                
                // if (!when) {
                // when = " - ";
                // } 
                let eventHour = `${when.toLocaleTimeString()}`
                if (eventHour =="Invalid Date") {
                    eventHour = "ALL DAY: "
                }
                console.log(eventHour);

                console.log(`WHEN IS : ${eventHour}`);
                
                newLi.innerHTML = eventHour + " " + element.summary;
                console.log(newLi.innerHTML);

                if (eventHour == "ALL DAY: ") {
                    console.log(eventHour);
                    document.getElementById("allDay_list").appendChild(newLi)
                } else {
                    document.getElementById("today_list").appendChild(newLi)
                };            
            });

        });
}
//Create a New events - form & execution

    function createEvent(){
        const form = document.getElementById("eventForm");
        
        document.getElementById("create-event").addEventListener("click", function (e) {
        //form.submit();

        let eventSummary = document.getElementById("input_name").value;
        console.log(eventSummary);

        let eventDescription = document.getElementById("input_description").value;
        console.log(eventDescription);

        let eventLocation = document.getElementById("input_location").value;
        console.log(eventLocation);

        let eventNew = {
            'summary': eventSummary,
            'location': eventLocation,
            'description': eventDescription,
            'start': {
                'dateTime': '2017-12-11T09:00:00-07:00',
                //'timeZone': 'Europe/Warsaw'
            },
            'end': {
                'dateTime': '2017-12-11T11:00:00-07:00',
                //'timeZone': 'Europe/Warsaw'
            },
        }
        
        let request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': eventNew
        });
    
        e.preventDefault();

        request.execute(function(eventNew) {
        console.log('Event created: ' + eventNew.htmlLink);
        });
        }); 
    }
