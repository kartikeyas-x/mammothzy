
-- Create activities table if it doesn't exist
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  activity_type TEXT,
  location_type TEXT,
  min_members INTEGER DEFAULT 1,
  max_members INTEGER DEFAULT 1,
  address_line_1 TEXT,
  address_line_2 TEXT,
  zip_code TEXT,
  city TEXT,
  state TEXT,
  contact_number TEXT,
  contact_name TEXT
);
