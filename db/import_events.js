
const csv = require('csv-parser');
const fs = require('fs');
const format = require('pg-format');
const {Client} = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'events',
  password: 'password',
  port: 5432,
});

readCSVFile();

function readCSVFile(){
  let events = [];
  fs.createReadStream('geo-event-data-full.csv')
  .pipe(csv())
  .on('data', (row) => {
    //console.log(row);
    events.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
    events = formatEvents(events);
    eventsInputArray = createEventList(events)
    connectToDB(eventsInputArray);
  });

}

function formatEvents(events){
  for(let event of events){
    event.id = parseInt(event.id);

    //handle price
    if(!event.price || event.price == ''){
      event.price = 0.00 //set event price to 0.00 if free
    }
    else{
      event.price = parseFloat(event.price);
    }

    event.location_lat = parseFloat(event.location_lat);
    event.location_long = parseFloat(event.location_long);

    event.score_upvotes = parseInt(event.score_upvotes);
    event.score_views = parseInt(event.score_views);

    event.creator_is_premium = event.creator_is_premium == 'True' ? true : false;

    if(event.tags){
      event.tags = event.tags.split("|");
      let formattedArray = '{';
      for(let value of event.tags){
        formattedArray += '"'+value+'",'
      }
      formattedArray = formattedArray.slice(0,formattedArray.length-1);
      formattedArray += '}'
      event.tags = formattedArray;
    }
    else{
      event.tags = null;
    }

    //presume all time data is given as UTC
    event.start = new Date(event.start);
    if(event.end == ''){
      event.end = null;
    }
    else{
      event.end = new Date(event.end).toUTCString();
    }
  }
  return events;
}

function createEventList(events) {
  let insertArray = [];
  for (let event of events) {
    let singleEntry = [];
    for(let att in event){
      singleEntry.push(event[att])
    }
    //console.log(singleEntry);
    insertArray.push(singleEntry);
  }
  return insertArray;
}

function connectToDB(eventsInputArray){
  client.connect((err, res) => {
    if (err == null) {
      importEvents(eventsInputArray);
    }
  });
}


function importEvents(eventsInputArray) {

  let query = format(
    'Insert into event (id,	name, price,	location_lat,	location_long,	score_upvotes,	score_views,	creator_id,	creator_is_premium, tags, start_time, end_time) values %L',
    eventsInputArray,
  );
  //console.log(query);

  client.query(query, (err, res) => {
    if (err) {
      console.log('ERROR');
      console.log(err);
    } else {
      console.log('Success');
      console.log(res);
    }
    client.end();
  });
}
