import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {EventsDataSource} from '../datasources';
import {Event, EventRelations, ScoredEvent} from '../models';
import { SearchEventsInput } from '../models/search-events.model';

export class EventRepository extends DefaultCrudRepository<
  Event,
  typeof Event.prototype.id,
  EventRelations
> {
  constructor(
    @inject('datasources.events') dataSource: EventsDataSource,
  ) {
    super(Event, dataSource);
  }

  public findEvents(input: SearchEventsInput) {
    let filter: any = this.constructSearchFilter(input);
    console.log(filter);

    return new Promise<ScoredEvent[]>((resolve, reject) => {
      this.find(filter)
        .then(result => {
          console.log(result)
          let bestResults = this.determineBestResults(result, input);
          resolve(bestResults);
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  public findEventById(id: number) {
    return new Promise<Event>((resolve, reject) => {
      this.findById(id)
        .then(result => {
          let event: Event = result;
          resolve(event);
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  private constructSearchFilter(input: SearchEventsInput) {
    let filter: any = {
      where: {},
      //order: ['creator_is_premium DESC', 'id ASC']
    };

    //add mandatory location filtering,  I am using the current bound of the google map on screen, this can of course be relaxed to include events just a hair offscreen
    filter.where.location_lat = {
      between : [input.bottom_left_lat, input.top_right_lat]
    }

    filter.where.location_long = {
      between : [input.bottom_left_long, input.top_right_long]
    }

    //add optional user filters
    if (input.nameFilter) {
      filter.where.name = {
        ilike: '%' + input.nameFilter + '%',
      };
    }
    if(input.priceFilter){
      filter.where.price = {
        lte : input.priceFilter
      };
    }

    if(input.startTime){
      filter.where.start_time = {
        gte : new Date(input.startTime)
      }
    }

    if(input.endTime){
      filter.where.end_time = {
        lte : input.endTime
      }
    }

    return filter;
  }

  
  private determineBestResults(events : any, input : SearchEventsInput){

    //Best Result: Premium with the highest upvote/views ratio (ALWAYS)
    //Remainder of the Results will be sorted on the same ratio but a non premium event will take prefernce if it has more than 1.3 the ratio of a premium event

    for(let event of events){
      if(event.views == 0){
        event.score_ratio = .1;
      }
      else{
        event.score_ratio = event.score_upvotes/event.score_views;
      }
      
      if(event.creator_is_premium){
        event.score_ratio = event.score_ratio*1.3; // premium events get a boost to their ratio over non premium
      }
    }

    events.sort((a : ScoredEvent, b : ScoredEvent) => {
      return a.score_ratio > b.score_ratio ? -1 : 1;
    });

    let bestEventIndex = -1;
    for(let i = 0; i < events.length; i++){
      if(events[i].creator_is_premium){
        bestEventIndex = i;
        break;
      }
    }

    //if there is a best premium event add it to the front
    if(bestEventIndex > 0){
      events.splice(0,1,events.splice(bestEventIndex,1)[0]);
    }

    //if no offset limit results
    if(!input.offset){
      //now based on the zoom I can determine the number of events to display
      //Continent or greater level show the top 10 events
      if(input.zoom <= 5){
        events.splice(10)
      }
      //city level lets show the top 20 events around town
      else if(input.zoom <= 10){
        events.splice(20)
      }
  
      //a few streets show lots of events near me
      else if(input.zoom <= 15){
        events.splice(30)
      }
      // do nothing if we are even more zoomed it and let the front end decided how they want to display the data
      else{
  
      }
    }
    //if we have an offset ignore zoom and return desired data
    else if(input.offset){
      if(!input.limit){
        input.limit = 50; //default page size if not provided
      }
      events = events.splice(input.offset, input.limit);
    }

    return events;
  }

}
