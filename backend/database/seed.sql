-- ==============================================================
-- Sample seed data (run AFTER food_ordering.sql)
-- ==============================================================
USE food_ordering;

-- Categories ----------------------------------------------------
INSERT INTO categories (name) VALUES
  ('Burgers'),
  ('Pizza'),
  ('Pasta'),
  ('Salads'),
  ('Drinks'),
  ('Desserts');

-- Menu items ----------------------------------------------------
INSERT INTO menu_items
  (name, description, price, category_id, prepare_time, image_url, is_available)
VALUES
  ('Classic Cheeseburger', 'Beef patty, cheddar, lettuce, tomato, onion, special sauce.', 7.50, 1, 12, NULL, 1),
  ('Double Bacon Burger',  'Two patties, bacon, melted cheese, BBQ sauce.',                10.90, 1, 15, NULL, 1),
  ('Margherita Pizza',     'Tomato sauce, mozzarella, fresh basil.',                        9.00,  2, 18, NULL, 1),
  ('Pepperoni Pizza',      'Tomato sauce, mozzarella, pepperoni.',                          11.00, 2, 18, NULL, 1),
  ('Spaghetti Bolognese',  'Classic Italian meat sauce over spaghetti.',                    8.50,  3, 14, NULL, 1),
  ('Caesar Salad',         'Romaine, parmesan, croutons, Caesar dressing.',                 6.00,  4, 6,  NULL, 1),
  ('Coca-Cola 330ml',      'Chilled soft drink.',                                           1.50,  5, 1,  NULL, 1),
  ('Fresh Orange Juice',   'Freshly squeezed orange juice.',                                2.50,  5, 3,  NULL, 1),
  ('Chocolate Brownie',    'Warm chocolate brownie with vanilla ice cream.',                4.00,  6, 5,  NULL, 1);
