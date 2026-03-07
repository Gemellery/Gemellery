USE gemellery;

ALTER TABLE jewelry_designs
  MODIFY COLUMN selected_image_url LONGTEXT;

ALTER TABLE jewelry_designs
  MODIFY COLUMN generated_images LONGTEXT NOT NULL;

ALTER TABLE jewelry_designs
  MODIFY COLUMN gem_image_url LONGTEXT;

ALTER TABLE jewelry_designs
  MODIFY COLUMN refinements LONGTEXT;
