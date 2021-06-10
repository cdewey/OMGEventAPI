# A Few Notes

- I have used Loopback and Postgres to implement my solution.
- Once setup is complete the API is self-documented and can be test at http://localhost:3000/explorer/

## Filters

I choose to allow the user to filter on name, price, start time and end time. The filters can all be used together or not at all.

- The name filter uses a case insensitive 'like' option
- Price limits the maximum price of an event (events with no price info were set to $0.00)
- Start time will show events on or after a given time
- End time will show events on or before a given time

## A note on Times

All datetimes in the database are in central time, datetimes provided in Zulu time (with a 'Z' at the end) were converted to central during the database population.
When using the API explorer for start and end times timezone information must be applied. When the API explorer loads it provided an example timestamp such as "2021-06-10T23:07:40.171Z" this will search based on UTC if you wish to search based on central time replace the "Z" with "-0500"
Example:
- Searching for a start time later than 2PM June 10th, 2021 Dallas time would look like "2021-06-10T14:00:00.000-0500"

## How are "BEST" results determined?
First results are queryed using the current bounds (the north-east and south-west corners) of the google API map and any user provided filters. Once those results are gathered that are further refined so the best results are listed first. Each result is given a score based on their ratio of upvotes to views. Premium events have their ratio multiplied by 1.3 to give them an edge. Further the premium event with the highest score will be the first result regardless of any non-premium events with a higher score.

## How is map clutter dealt with?
Using the current zoom level of the google API map I determine how many results to return. The user has pagination options if they want more.

Zoom Level
- <= 5: Landmass/continent = 10 results
- <= 10: City = 20 Results
- <= 15: Streets = 30 Results
- \> 15: Buildings = Unlimited (unless a limit flag is passed)

## Short Comings
- I should add a flag to ignore zoom clutter limitations
- Distance from the user to the event is never calculated. This is less impactful at high zoom but would be a nice feature at lower zooms.
- Events just outside the the map are not considered. But this can be easily fixed by artifically increasing the bounds on the backend.
- The best result algorithm is simple and ignores some rather important aspects
    - Events with few upvotes/views can easily be ranked very highly
    - New Events may have a hard time gaining traction
    - Views a straight forward metric where as upvotes are a bit more subjective. There may be a lot of peopple interested in an event that dont upvote it.

