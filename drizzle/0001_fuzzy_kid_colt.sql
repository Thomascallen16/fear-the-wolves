CREATE TABLE `user_openai_connections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`encrypted_api_key` text NOT NULL,
	`key_hint` varchar(16) NOT NULL,
	`model` varchar(64) NOT NULL DEFAULT 'gpt-5.6',
	`validated_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_openai_connections_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_openai_connections_user_id_unique` UNIQUE(`user_id`)
);
