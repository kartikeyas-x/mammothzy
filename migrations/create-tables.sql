
-- Create activities table if it doesn't exist
CREATE TABLE IF NOT EXISTS "activities" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add any indexes
CREATE INDEX IF NOT EXISTS "activities_name_idx" ON "activities" ("name");
