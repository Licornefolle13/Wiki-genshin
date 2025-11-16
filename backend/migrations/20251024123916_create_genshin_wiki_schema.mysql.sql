CREATE TABLE IF NOT EXISTS characters (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL UNIQUE,
  rarity INT NOT NULL CHECK (rarity IN (4,5)),
  element VARCHAR(100) NOT NULL,
  weapon_type VARCHAR(100) NOT NULL,
  region VARCHAR(100) NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP;
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS weapons (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL UNIQUE,
  type VARCHAR(100) NOT NULL,
  rarity INT NOT NULL CHECK (rarity BETWEEN 1 AND 5),
  base_attack INT DEFAULT 0,
  secondary_stat VARCHAR(100) DEFAULT '',
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE artifact_sets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    set_name VARCHAR(255) NOT NULL,
    rarity VARCHAR(10) NOT NULL,
    two_piece_bonus TEXT,
    four_piece_bonus TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
);


CREATE TABLE artifact_pieces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    set_id INT NOT NULL,
    slot ENUM('Flower', 'Plume', 'Sands', 'Goblet', 'Circlet') NOT NULL,
    name VARCHAR(255) NOT NULL,
    image_url VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (set_id) REFERENCES artifact_sets(id) ON DELETE CASCADE
);




-- Indexes: drop-if-exists then create to be idempotent
DROP INDEX IF EXISTS idx_characters_element ON characters;
CREATE INDEX idx_characters_element ON characters(element);

DROP INDEX IF EXISTS idx_characters_weapon_type ON characters;
CREATE INDEX idx_characters_weapon_type ON characters(weapon_type);

DROP INDEX IF EXISTS idx_weapons_type ON weapons;
CREATE INDEX idx_weapons_type ON weapons(weapon_type);

DROP INDEX IF EXISTS idx_map_markers_category ON map_markers;
CREATE INDEX idx_map_markers_category ON map_markers(category);

DROP INDEX IF EXISTS idx_map_markers_region ON map_markers;
CREATE INDEX idx_map_markers_region ON map_markers(region);

-- Notes:
-- If you prefer compact UUID storage, consider changing CHAR(36) -> BINARY(16) and use UNHEX(REPLACE(UUID(),'-','')) on insert.
