DELETE FROM category;

INSERT INTO category (logo, name, flag, created_date, created_by) VALUES ('fa fa-shopping-cart', 'ALL', 'Popular', SYSTIMESTAMP, 'system');
INSERT INTO category (logo, name, flag, created_date, created_by) VALUES ('fa fa-hamburger', 'Foods', 'Special', SYSTIMESTAMP, 'system');
INSERT INTO category (logo, name, flag, created_date, created_by) VALUES ('fa fa-pizza-slice', 'Fast Food', 'Special', SYSTIMESTAMP, 'system');
INSERT INTO category (logo, name, flag, created_date, created_by) VALUES ('fa fa-utensils', 'Other Foods', 'Lovely', SYSTIMESTAMP, 'system');
INSERT INTO category (logo, name, flag, created_date, created_by) VALUES ('fa fa-ice-cream', 'Cold Drinks', 'Lovely', SYSTIMESTAMP, 'system');
INSERT INTO category (logo, name, flag, created_date, created_by) VALUES ('fa fa-coffee', 'Hot Drinks', 'Lovely', SYSTIMESTAMP, 'system');
INSERT INTO category (logo, name, flag, created_date, created_by) VALUES ('fa fa-birthday-cake', 'Sweets', 'Lovely', SYSTIMESTAMP, 'system');

COMMIT;

SELECT * FROM category;