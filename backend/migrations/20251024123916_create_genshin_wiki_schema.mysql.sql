-- Converted MySQL migration (idempotent-ish) from
-- supabase/migrations/20251024123916_create_genshin_wiki_schema.sql
-- Notes:
--  - UUIDs are stored as CHAR(36) using MySQL's UUID() function
--  - Postgres row-level security and policies are omitted (MySQL doesn't support RLS)
--  - timestamptz -> TIMESTAMP (MySQL does not store TZ information)
--  - latitude/longitude converted to lat/lng and stored as DECIMAL(10,6)
--  - weapons.type renamed to weapon_type to match application code
--  - artifacts.rarity was added to match backend expectations

-- Characters table
CREATE TABLE IF NOT EXISTS `characters` (
  `id` CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `rarity` INT NOT NULL CHECK (`rarity` IN (4,5)),
  `element` VARCHAR(100) NOT NULL,
  `weapon_type` VARCHAR(100) NOT NULL,
  `region` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT '',
  `image_url` TEXT DEFAULT '',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP;
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Weapons table (rename column `type` -> `weapon_type` to match app)
CREATE TABLE IF NOT EXISTS `weapons` (
  `id` CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `weapon_type` VARCHAR(100) NOT NULL,
  `rarity` INT NOT NULL CHECK (`rarity` BETWEEN 1 AND 5),
  `base_attack` INT DEFAULT 0,
  `secondary_stat` VARCHAR(100) DEFAULT '',
  `description` TEXT DEFAULT '',
  `image_url` TEXT DEFAULT '',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Artifacts table (added `rarity` column to match backend queries)
CREATE TABLE IF NOT EXISTS `artifacts` (
  `id` CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  `set_name` VARCHAR(255) NOT NULL,
  `piece_type` VARCHAR(50) NOT NULL,
  `rarity` INT DEFAULT 5,
  `two_piece_bonus` TEXT DEFAULT '',
  `four_piece_bonus` TEXT DEFAULT '',
  `description` TEXT DEFAULT '',
  `image_url` TEXT DEFAULT '',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Map markers table (use `lat`/`lng` to match backend)
CREATE TABLE IF NOT EXISTS `map_markers` (
  `id` CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  `name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `region` VARCHAR(100) NOT NULL,
  `lat` DECIMAL(10,6) NOT NULL,
  `lng` DECIMAL(10,6) NOT NULL,
  `description` TEXT DEFAULT '',
  `icon_type` VARCHAR(100) DEFAULT '',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes: drop-if-exists then create to be idempotent
DROP INDEX IF EXISTS `idx_characters_element` ON `characters`;
CREATE INDEX `idx_characters_element` ON `characters`(`element`);

DROP INDEX IF EXISTS `idx_characters_weapon_type` ON `characters`;
CREATE INDEX `idx_characters_weapon_type` ON `characters`(`weapon_type`);

DROP INDEX IF EXISTS `idx_weapons_type` ON `weapons`;
CREATE INDEX `idx_weapons_type` ON `weapons`(`weapon_type`);

DROP INDEX IF EXISTS `idx_map_markers_category` ON `map_markers`;
CREATE INDEX `idx_map_markers_category` ON `map_markers`(`category`);

DROP INDEX IF EXISTS `idx_map_markers_region` ON `map_markers`;
CREATE INDEX `idx_map_markers_region` ON `map_markers`(`region`);

-- Notes:
-- If you prefer compact UUID storage, consider changing `CHAR(36)` -> `BINARY(16)` and use UNHEX(REPLACE(UUID(),'-','')) on insert.
