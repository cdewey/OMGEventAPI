import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict : false, idInjection: false, postgresql: {schema: 'public', table: 'event'}}})
export class Event extends Entity {
  @property({
    type: 'number',
    required: true,
    scale: 0,
    id: 1,
    postgresql: {columnName: 'id', dataType: 'integer', nullable: 'NO'},
  })
  id: number;

  @property({
    type: 'string',
    required: true,
    postgresql: {columnName: 'name', dataType: 'text', nullable: 'NO'},
  })
  name: string;

  @property({
    type: 'number',
    required: true,
    scale: 0,
    postgresql: {columnName: 'price', dataType: 'double precision', nullable: 'NO'},
  })
  price: number;

  @property({
    type: 'number',
    required: true,
    scale: 0,
    postgresql: {columnName: 'location_lat', dataType: 'double precision', nullable: 'NO'},
  })
  location_lat: number;

  @property({
    type: 'number',
    required: true,
    scale: 0,
    postgresql: {columnName: 'location_long', dataType: 'double precision', nullable: 'NO'},
  })
  location_long: number;

  @property({
    type: 'number',
    required: true,
    scale: 0,
    postgresql: {columnName: 'score_upvotes', dataType: 'integer', nullable: 'NO'},
  })
  score_upvotes: number;

  @property({
    type: 'number',
    required: true,
    scale: 0,
    postgresql: {columnName: 'score_views', dataType: 'integer', nullable: 'NO'},
  })
  score_views: number;

  @property({
    type: 'string',
    required: true,
    postgresql: {columnName: 'creator_id', dataType: 'text', nullable: 'NO'},
  })
  creator_id: string;

  @property({
    type: 'boolean',
    required: true,
    postgresql: {columnName: 'creator_is_premium', dataType: 'boolean', nullable: 'NO'},
  })
  creator_is_premium: boolean;

  @property({
    type: 'array',
    itemType: 'string',
    postgresql: {columnName: 'tags', dataType: 'array', nullable: 'YES'},
  })
  tags?: string[];

  @property({
    type: 'date',
    required: true,
    postgresql: {columnName: 'start_time', dataType: 'timestamp', nullable: 'NO'},
  })
  start_time: string;

  @property({
    type: 'date',
    postgresql: {columnName: 'end_time', dataType: 'timestamp', nullable: 'YES'},
  })
  end_time: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Event>) {
    super(data);
  }
}

export class ScoredEvent extends Event{
  @property({
    type: 'number',
    required: false,
  })
  score_ratio: number;
}

export interface EventRelations {
  // describe navigational properties here
}

export type EventWithRelations = Event & EventRelations;
