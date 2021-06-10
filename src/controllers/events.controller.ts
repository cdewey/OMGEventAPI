// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';
import { repository } from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import { Event, ScoredEvent, SearchEventsInput } from '../models';
import { EventRepository } from '../repositories';

export class EventsController {
  constructor(
    @repository(EventRepository)
    public eventRepository: EventRepository,
  ) {}

  @post('/events')
  @response(200, {
    description: 'Returns an Event array based on map bounds and filter values, will be sorted to return the "best" result first.',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ScoredEvent, {includeRelations: false}),
        },
      },
    },
  })
  async find(@requestBody() input: SearchEventsInput): Promise<ScoredEvent[]> {
    return this.eventRepository.findEvents(input);
  }

  @get('/events/id/{id}')
  @response(200, {
    description: 'Get event by Id',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Event, {includeRelations: false}),
      },
    },
  })
  async findById(@param.path.string('id') id: number): Promise<Event> {
    return this.eventRepository.findEventById(id);
  }

}
