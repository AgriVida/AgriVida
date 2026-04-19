-- Migration: Create FridgeToFarm schema
-- Created: 2026-04-19

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- Hubs
-- =============================================================================
CREATE TABLE IF NOT EXISTS hubs (
  id           uuid        NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  name         text        NOT NULL,
  phone        text        NOT NULL,
  email        text        NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- =============================================================================
-- Farmers
-- =============================================================================
CREATE TABLE IF NOT EXISTS farmers (
  id              uuid        NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  name            text        NOT NULL,
  phone           text        NOT NULL UNIQUE,
  address_text    text        NOT NULL,
  latitude        float8      NOT NULL,
  longitude       float8      NOT NULL,
  opted_out       boolean     NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_farmers_location ON farmers (latitude, longitude);

-- =============================================================================
-- Routes
-- =============================================================================
CREATE TABLE IF NOT EXISTS routes (
  id              uuid        NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  hub_id          uuid        NOT NULL REFERENCES hubs(id) ON DELETE RESTRICT,
  title           text        NOT NULL,
  route_polyline  text        NOT NULL DEFAULT '',
  start_lat       float8      NOT NULL,
  start_lng       float8      NOT NULL,
  end_lat         float8      NOT NULL,
  end_lng         float8      NOT NULL,
  start_time      timestamptz NOT NULL,
  end_time        timestamptz NOT NULL,
  notes           text,
  published       boolean     NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_routes_hub_id    ON routes (hub_id);
CREATE INDEX IF NOT EXISTS idx_routes_published ON routes (published);

-- =============================================================================
-- Route Responses
-- =============================================================================
CREATE TABLE IF NOT EXISTS route_responses (
  id              uuid        NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  route_id        uuid        NOT NULL REFERENCES routes(id) ON DELETE RESTRICT,
  farmer_id       uuid        NOT NULL REFERENCES farmers(id) ON DELETE RESTRICT,
  response_type   text        NOT NULL CHECK (response_type IN ('crop_pickup', 'compost_pickup', 'both')),
  status          text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (route_id, farmer_id)
);

CREATE INDEX IF NOT EXISTS idx_route_responses_route_id  ON route_responses (route_id);
CREATE INDEX IF NOT EXISTS idx_route_responses_farmer_id ON route_responses (farmer_id);

-- =============================================================================
-- Notification Log
-- =============================================================================
CREATE TABLE IF NOT EXISTS notification_log (
  id              uuid        NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  route_id        uuid        NOT NULL REFERENCES routes(id) ON DELETE RESTRICT,
  farmer_id       uuid        NOT NULL REFERENCES farmers(id) ON DELETE RESTRICT,
  status          text        NOT NULL CHECK (status IN ('sent', 'failed', 'opted_out')),
  twilio_sid      text,
  error_message   text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notification_log_route_id  ON notification_log (route_id);
CREATE INDEX IF NOT EXISTS idx_notification_log_farmer_id ON notification_log (farmer_id);

-- =============================================================================
-- Utility: haversine distance in miles between two lat/lng points
-- =============================================================================
CREATE OR REPLACE FUNCTION haversine_miles(
  lat1 float8,
  lng1 float8,
  lat2 float8,
  lng2 float8
) RETURNS float8
LANGUAGE plpgsql IMMUTABLE
AS $$
DECLARE
  r      float8 := 3958.8;  -- Earth radius in miles
  dlat   float8;
  dlng   float8;
  a      float8;
  c      float8;
BEGIN
  dlat := radians(lat2 - lat1);
  dlng := radians(lng2 - lng1);
  a := sin(dlat / 2) ^ 2
     + cos(radians(lat1)) * cos(radians(lat2))
     * sin(dlng / 2) ^ 2;
  c := 2 * atan2(sqrt(a), sqrt(1 - a));
  RETURN r * c;
END;
$$;

-- =============================================================================
-- Find farmers within N miles of any point in a route
-- route_points: JSON array of {lat, lng} objects  (e.g. start + end, or decoded polyline)
-- radius_miles: search radius (default 10)
-- Returns farmer rows with min_distance_miles from the nearest route point
-- =============================================================================
CREATE OR REPLACE FUNCTION find_farmers_near_route_points(
  route_points   jsonb,
  radius_miles   float8 DEFAULT 10
) RETURNS TABLE (
  farmer_id          uuid,
  farmer_name        text,
  phone              text,
  address_text       text,
  latitude           float8,
  longitude          float8,
  min_distance_miles float8
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    f.id,
    f.name,
    f.phone,
    f.address_text,
    f.latitude,
    f.longitude,
    min(
      haversine_miles(
        f.latitude, f.longitude,
        (pt->>'lat')::float8, (pt->>'lng')::float8
      )
    ) AS min_distance_miles
  FROM farmers f
  CROSS JOIN jsonb_array_elements(route_points) AS pt
  WHERE f.opted_out = false
  GROUP BY f.id, f.name, f.phone, f.address_text, f.latitude, f.longitude
  HAVING min(
    haversine_miles(
      f.latitude, f.longitude,
      (pt->>'lat')::float8, (pt->>'lng')::float8
    )
  ) <= radius_miles
  ORDER BY min_distance_miles ASC;
END;
$$;
