-- ==============================================================
-- Migration 001: Soft delete for menu_items and categories
-- ==============================================================
-- Apply with:
--   mysql -u root -p food_ordering < database/migrations/001-soft-delete-menu-categories.sql
--
-- What it does:
--   1. Adds `deleted_at TIMESTAMP NULL` to menu_items and categories.
--   2. Replaces the simple UNIQUE on categories.name with a partial
--      index (via a generated column) so a name can be reused once
--      the original category has been retired.
--   3. Adds indexes on deleted_at for fast filtering.
--
-- After this migration, the DELETE endpoints on /api/menu/:id and
-- /api/categories/:id stop failing on FK constraints. Instead they
-- set deleted_at = NOW() and (for menu items) is_available = 0.
-- Historical orders still join successfully to retrieve the original
-- name/category, because the rows physically remain in the table.
-- ==============================================================

USE food_ordering;

-- -- menu_items --------------------------------------------------
ALTER TABLE menu_items
  ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL AFTER is_available,
  ADD INDEX idx_menu_items_deleted_at (deleted_at);

-- -- categories --------------------------------------------------
-- Drop the existing UNIQUE(name) so we can replace it with a constraint
-- that ignores soft-deleted rows.
ALTER TABLE categories
  ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL AFTER updated_at,
  ADD INDEX idx_categories_deleted_at (deleted_at),
  DROP INDEX uq_categories_name;

-- Re-add uniqueness but only for live rows.
-- MySQL doesn't support partial indexes directly, so we use a
-- generated column that is NULL for deleted rows and equals `name`
-- for live ones, then enforce UNIQUE on that generated column.
ALTER TABLE categories
  ADD COLUMN name_unique VARCHAR(100)
    GENERATED ALWAYS AS (IF(deleted_at IS NULL, name, NULL)) STORED,
  ADD UNIQUE KEY uq_categories_name_live (name_unique);

-- Same idea on menu_items so admins can reuse names of retired items.
-- (The original schema didn't have UNIQUE on menu_items.name, so
-- we don't need to do anything for it.)
