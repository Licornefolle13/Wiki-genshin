/*
  # Genshin Impact Wiki Database Schema

  1. New Tables
    - `characters`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `rarity` (integer, 4 or 5 stars)
      - `element` (text, vision type)
      - `weapon_type` (text)
      - `region` (text)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
    
    - `weapons`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `type` (text, weapon category)
      - `rarity` (integer, 1-5 stars)
      - `base_attack` (integer)
      - `secondary_stat` (text)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
    
    - `artifacts`
      - `id` (uuid, primary key)
      - `set_name` (text)
      - `piece_type` (text, flower/feather/sands/goblet/circlet)
      - `two_piece_bonus` (text)
      - `four_piece_bonus` (text)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
    
    - `map_markers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text, oculus/chest/boss/resource)
      - `region` (text)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `description` (text)
      - `icon_type` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add public read policies for wiki content
*/

-- Characters table
CREATE TABLE IF NOT EXISTS characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  rarity integer NOT NULL CHECK (rarity IN (4, 5)),
  element text NOT NULL,
  weapon_type text NOT NULL,
  region text NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view characters"
  ON characters FOR SELECT
  TO public
  USING (true);

-- Weapons table
CREATE TABLE IF NOT EXISTS weapons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  type text NOT NULL,
  rarity integer NOT NULL CHECK (rarity BETWEEN 1 AND 5),
  base_attack integer DEFAULT 0,
  secondary_stat text DEFAULT '',
  description text DEFAULT '',
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weapons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view weapons"
  ON weapons FOR SELECT
  TO public
  USING (true);

-- Artifacts table
CREATE TABLE IF NOT EXISTS artifacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  set_name text NOT NULL,
  piece_type text NOT NULL,
  two_piece_bonus text DEFAULT '',
  four_piece_bonus text DEFAULT '',
  description text DEFAULT '',
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view artifacts"
  ON artifacts FOR SELECT
  TO public
  USING (true);

-- Map markers table
CREATE TABLE IF NOT EXISTS map_markers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  region text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  description text DEFAULT '',
  icon_type text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE map_markers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view map markers"
  ON map_markers FOR SELECT
  TO public
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_characters_element ON characters(element);
CREATE INDEX IF NOT EXISTS idx_characters_weapon_type ON characters(weapon_type);
CREATE INDEX IF NOT EXISTS idx_weapons_type ON weapons(type);
CREATE INDEX IF NOT EXISTS idx_map_markers_category ON map_markers(category);
CREATE INDEX IF NOT EXISTS idx_map_markers_region ON map_markers(region);