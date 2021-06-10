import {Model, model, property} from '@loopback/repository';

@model()
export class SearchEventsInput extends Model {

  @property({
    type: 'number',
    required: true,
    description: 'The Latitude of the North-East map bound provided by google maps API'
  })
  top_right_lat : number;

  @property({
    type: 'number',
    required: true,
    description: 'The Longitude of the North-East map bound provided by google maps API'
  })
  top_right_long : number;

  @property({
    type: 'number',
    required: true,
    description: 'The Latitude of the South-West map bound provided by google maps API'
  })
  bottom_left_lat : number;

  @property({
    type: 'number',
    required: true,
    description: 'The Longitude of the South-West map bound provided by google maps API'
  })
  bottom_left_long : number;

  @property({
    type: 'number',
    required: true,
    description : 'The current zoom of the google API map',
    jsonSchema: {
      minimum: 0,
      maximum: 21
    },
  })
  zoom : number;
  //Refernce on zoom levels from https://developers.google.com/maps/documentation/javascript/overview#zoom-levels
  // 1: World
  // 5: Landmass/continent
  // 10: City
  // 15: Streets
  // 20: Buildings

  @property({
    type: 'string',
    description : 'Optional ability to filter events by there name',
    jsonSchema: {
      maxLength: 300,
      minLength: 1,
    },
  })
  nameFilter?: string;

  @property({
    type: 'number',
    description : 'Optional filter to limit the maximum price of an event',
    jsonSchema: {
      minimum: 0,
    },
  })
  priceFilter?: number;

  @property({
    type: 'date',
    description : 'Optional filter to find events that start after a given date',
  })
  startTime?: string;

  @property({
    type: 'date',
    description : 'Optional filter to find events that end before a given date',
  })
  endTime?: string;

  @property({
    type: 'number',
    description : 'Optional limit tp the number of results returned, defaults to 50 if an offset is provided without a limit',
    jsonSchema: {
      minimum: 0,
    },
  })
  limit?: number;

  @property({
    type: 'number',
    description : 'Optional offset of the results, can be used for pagination',
    jsonSchema: {
      minimum: 0,
    },
  })
  offset?: number;

  constructor(data?: Partial<SearchEventsInput>) {
    super(data);
  }
}

export interface SearchEventsInputRelations {
  // describe navigational properties here
}

export type SearchEventsInputWithRelations = SearchEventsInput & SearchEventsInputRelations;
