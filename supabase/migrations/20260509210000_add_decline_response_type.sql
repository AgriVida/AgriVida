-- Extend route_responses.response_type to allow farmers to decline a route invitation.
ALTER TABLE route_responses
  DROP CONSTRAINT route_responses_response_type_check;

ALTER TABLE route_responses
  ADD CONSTRAINT route_responses_response_type_check
  CHECK (response_type IN ('crop_pickup', 'compost_pickup', 'both', 'decline'));
