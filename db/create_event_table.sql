CREATE TABLE IF NOT EXISTS event (
   id integer primary key,
   name text not null,
   price double precision not null,
   location_lat double precision not null,
   location_long double precision not null,
   score_upvotes integer not null,
   score_views integer not null,
   creator_id text not null,
   creator_is_premium boolean not null,
   tags text[],
   start_time  timestamp with time zone not null,
   end_time  timestamp with time zone
);
