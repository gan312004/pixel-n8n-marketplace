CREATE TABLE `agents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`price` integer NOT NULL,
	`rating` real DEFAULT 0 NOT NULL,
	`downloads` integer DEFAULT 0 NOT NULL,
	`description` text NOT NULL,
	`features` text NOT NULL,
	`requirements` text NOT NULL,
	`image` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `bundles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`original_price` integer NOT NULL,
	`bundle_price` integer NOT NULL,
	`discount` integer NOT NULL,
	`templates` text NOT NULL,
	`saves` integer NOT NULL,
	`image` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `templates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`price` integer NOT NULL,
	`rating` real DEFAULT 0 NOT NULL,
	`downloads` integer DEFAULT 0 NOT NULL,
	`description` text NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`features` text NOT NULL,
	`requirements` text NOT NULL,
	`image` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `user` ADD `is_admin` integer DEFAULT false NOT NULL;