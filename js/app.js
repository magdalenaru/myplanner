

// /*Get List of Events by day */   

// function appendDay(events) {
//         var eventsToday = document.getElementsByClassName('events_day');
//         console.log(eventsToday);
//         var eventsTodaycontent = document.createTextNode(events + '\n');
//         eventsToday.appendChild(eventsTodaycontent);
//       }

// function listEventsByDay() {
//     gapi.client.calendar.events.list({
//         'calendarId': 'primary',
//         'maxResults': 15,
//         'orderBy': 'startTime',
//         'timeMin': (new Date()).toISOString() 
//         //'timeMax': new Date(timestamp)
//     }).then(function(response) {
//         console.log(response);
//         var eventsDay = response.result.items;
//         appendDay('Today events:');
        
//         if (eventsDay.length > 0) {
//             for (i = 0; i < eventsDay.length; i++) {
//               var eventsDay = eventsDay[i];
//               var day = eventsDay.start.dateTime;
//               if (!day) {
//                 day = event.start.date;
//               }
//               appendDay(eventsDay.summary + ' (' + day + ')')
//             }
//           } else {
//             appendDay('No events for today found.');
//           }
//         });
//     }    

//     listEventsByDay();


    //   function listUpcomingEvents() {
    //     gapi.client.calendar.events.list({
    //       'calendarId': 'primary',
    //       'timeMin': (new Date()).toISOString(),
    //       'showDeleted': false,
    //       'singleEvents': true,
    //       'maxResults': 5,
    //       'orderBy': 'startTime'
    //     }).then(function(response) {
    //       var events = response.result.items;
    //       appendPre('Upcoming events:');



