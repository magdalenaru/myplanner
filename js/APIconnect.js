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

//if signed in - show table
    // function showTable() {
    //   if (isSignedIn) {

    //   }
    // }


//list events in console & in every day
    function listEvents(){

        var today = new Date();
        var aftertomorrow = new Date(today.getTime() + (72 * 60 * 60 * 1000));

        let request = gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            //'timeMax': (new Date()).toISOString(),
            'timeMax': aftertomorrow.toISOString(),
            'maxResults': 10,
            'singleEvents': true,
            'orderBy': 'startTime'
        });
        request.execute(function(resp){
            let todayEvents = resp.items;

            todayEvents.forEach(function(element) {
                let newLi = document.createElement("LI");
                
                let when = new Date(element.start.dateTime);

                // let whenDate = new Date(element.start.date);
                // console.log(whenDate);
                
                var options = { weekday: 'short', month: 'short', day: 'numeric' };
                let eventDate = `${when.toLocaleDateString('en-GB', options)}`
                if (eventDate =="Invalid Date") {
                    eventDate = "ALL DAY: "
                }

                let eventHour = `${when.toLocaleTimeString()}`
                if (eventHour =="Invalid Date") {
                    eventHour = "ALL DAY: "
                }
                
                newLi.innerHTML = eventDate + " " + eventHour + " " + element.summary;

                if (eventHour == "ALL DAY: ") {
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

        let eventSummary = document.getElementById("input_name").value;
        let eventDescription = document.getElementById("input_description").value;
        let eventLocation = document.getElementById("input_location").value;

        let eventNew = {
            'summary': eventSummary,
            'location': eventLocation,
            'description': eventDescription,
            'start': {
                'dateTime': '2017-12-17T10:00:00-07:00',
                //'timeZone': 'Europe/Warsaw'
            },
            'end': {
                'dateTime': '2017-12-17T13:00:00-07:00',
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

//Create Goal & add them to the list

  function addGoal () {
    const buttonGoal = document.getElementById("buttonGoal");
   
    buttonGoal.addEventListener("click", function (e) {
      let goal = prompt("What do you want to achieve this week?", "watch Kevin Sam w domu?");

      if (goal == null || goal == "") {
          txt = "No goals for today";
      } else {
          txt = goal;
      }
      let newLi = document.createElement("LI");
      newLi.innerHTML = txt;
 
      document.getElementById("mygoals").appendChild(newLi)

    });
  };

  addGoal ();

  //Show 7 habits after clicking on a button

  function showSeven () {
    const buttonSeven = document.getElementById("buttonSeven");
    
    const listSeven = document.getElementById("list-seven")

    var listVisibility = window.getComputedStyle(listSeven).visibility;
    console.log(listVisibility);

    buttonSeven.addEventListener("click", function (e){
      e.preventDefault();
      listSeven.classList.add("seven-clicked");
      console.log(listSeven.classList);
    })
  }

  showSeven ();