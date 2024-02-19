GRANT ALL ON *.* TO root@'%';
CREATE DATABASE IF NOT EXISTS test;
CREATE USER 'test'@'localhost' IDENTIFIED WITH mysql_native_password BY 'testtest';
GRANT ALL ON test.* to test@'localhost';
GRANT ALL ON test.* to test@'%';


-- USE test;

-- DROP TABLE IF EXISTS `test`.`point_use`;
-- DROP TABLE IF EXISTS `test`.`point`;
-- DROP TABLE IF EXISTS `test`.`post`;
-- DROP TABLE IF EXISTS `test`.`relation_detail`;
-- DROP TABLE IF EXISTS `test`.`relation`;
-- DROP TABLE IF EXISTS `test`.`user`;



-- -- test.`user` definition
-- CREATE TABLE test.`user` (
--   `id` int NOT NULL AUTO_INCREMENT,
--   `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
--   `password` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
--   `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
--   `leave_reason` ENUM('흥미로운 컨텐츠가 부족해서', '친구가 없어서', '기타') DEFAULT NULL,
--   `leave_reason_detail` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
--   `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
--   `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
--   `deleted_at` datetime(6) DEFAULT null NULL,
--   PRIMARY KEY (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -- test.`relation` definition
-- CREATE TABLE test.`relation` (
--   `id` int NOT NULL AUTO_INCREMENT,
--   `user_id`  int NOT NULL,
--   `friend_id`  int NOT NULL,
--   `relation_name` ENUM('FOLLOW', 'BLOCKED') NOT NULL DEFAULT 'FOLLOW',
--   `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
--   `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
--   `deleted_at` datetime(6) DEFAULT null NULL,
--   PRIMARY KEY (`id`),
--     KEY `FK_friend` (`user_id`),
--   CONSTRAINT `FK_user_FK_friendautority` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -- test.`relation_detail` definition
-- CREATE TABLE test.`relation_detail` (
--   `id` int NOT NULL AUTO_INCREMENT,
--   `relation_id`  int NOT NULL,
--   `relation_name` ENUM('FOLLOW', 'UNFOLLOW', 'BLOCKED', 'NON_BLOCKED') NOT NULL DEFAULT 'FOLLOW',
--   `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
--   PRIMARY KEY (`id`),
--     KEY `FK_relation_detail` (`relation_id`),
--   CONSTRAINT `FK_relation_detail` FOREIGN KEY (`relation_id`) REFERENCES `relation` (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- -- test.`post` definition
-- CREATE TABLE test.`post` (
--   `id` int NOT NULL AUTO_INCREMENT,
--   `title` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
--   `content` text COLLATE utf8mb4_general_ci NOT NULL,
--   `scope`  ENUM('PUBLIC', 'FRIEND', 'PRIVATE') NOT NULL DEFAULT 'PRIVATE',
--   `image_url` varchar(1000) COLLATE utf8mb4_general_ci DEFAULT NULL,
--   `author_id` int NOT NULL,
--   `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
--   `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
--   `deleted_at` datetime(6) DEFAULT NULL NULL,
--   PRIMARY KEY (`id`),
--   KEY `FK_post` (`author_id`),
--   CONSTRAINT `FK_post` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



-- -- test.`point` definition
-- CREATE TABLE `test`.`point` (
--   `id` int NOT NULL AUTO_INCREMENT,
--   `category` enum('SAVE','USE','USE_CANCLE') COLLATE utf8mb4_unicode_ci NOT NULL,
--   `amount` int NOT NULL,
--   `breakdown` varchar(255) COLLATE utf8mb4_unicode_ci,
--   `expiresin_date` date NOT NULL DEFAULT (date_format((now() + interval 1 year),_utf8mb4'%Y-%m-%d')),
--   `user_id` int NOT NULL,
--   `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
--   PRIMARY KEY (`id`),
--   KEY `FK_9399c30a2304f6948938f84b06d` (`user_id`),
--   CONSTRAINT `FK_9399c30a2304f6948938f84b06d` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- CREATE TABLE `test`.`point_use` (
--   `id` int NOT NULL AUTO_INCREMENT,
--   `point_id_use` int NOT NULL,
--   `point_id` int NOT NULL,
--   `amount` int NOT NULL,
--   `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
--   PRIMARY KEY (`id`),
--   KEY `FK_cc8b26f836bfcad25b443f0b421` (`point_id`),
--   CONSTRAINT `FK_cc8b26f836bfcad25b443f0b421` FOREIGN KEY (`point_id`) REFERENCES `point` (`id`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- INSERT INTO test.`user` (id, email, password, username, leave_reason, leave_reason_detail, created_at, deleted_at) VALUES(1, 'wishty1@gmail.com', '$2b$10$P6IJruL7AfWF1jlSepm8W.dY3SimD/vTCUk.mN0.5x6ee1eAeaFn2', 'wishty1', NULL, NULL, '2022-12-28 17:41:49.634557', NULL);
-- INSERT INTO test.`user` (id, email, password, username, leave_reason, leave_reason_detail, created_at, deleted_at) VALUES(2, 'wishty2@gmail.com', '$2b$10$agzWXPCbC.rhR1ATKcEm2uch0AfgK2A6wVqHG/YIjjOjggFvNNd5S', 'wishty2', NULL, NULL, '2022-12-28 21:48:40.217217', NULL);
-- INSERT INTO test.`user` (id, email, password, username, leave_reason, leave_reason_detail, created_at, deleted_at) VALUES(3, 'wishty3@gmail.com', '$2b$10$NQP4JW36d5.96U7JQgKiL.qBcQqjvF8OZLFAR3JMrGdTRUK06zQx2', 'wishty3', NULL, NULL, '2022-12-28 22:20:26.448070', NULL);

-- INSERT INTO test.`point` (id, category, amount, breakdown, expiresin_date, user_id, created_at) VALUES(1, 'SAVE', 10000, '가입축하 적립',  '2022-12-19', 1, '2021-12-19 01:16:00.841971');
-- INSERT INTO test.`point` (id, category, amount, breakdown, expiresin_date, user_id, created_at) VALUES(2, 'SAVE', 5000, '추천인 적립',  '2023-12-19', 1, '2022-12-19 01:45:45.611627');
-- INSERT INTO test.`point` (id, category, amount, breakdown, expiresin_date, user_id, created_at) VALUES(3, 'SAVE', 10000, '가입축하 적립',  '2023-12-19', 2,  '2022-12-19 02:41:16.054394');
-- INSERT INTO test.`point` (id, category, amount, breakdown, expiresin_date, user_id, created_at) VALUES(4, 'SAVE', 5000, '추천인 적립',  '2023-12-19', 2, '2022-12-19 01:16:00.841971');
-- INSERT INTO test.`point` (id, category, amount, breakdown, expiresin_date, user_id, created_at) VALUES(5, 'SAVE', 50000, '당첨적립',  '2023-12-19', 3, '2022-12-19 02:59:54.923237');
-- INSERT INTO test.`point` (id, category, amount, breakdown, expiresin_date, user_id, created_at) VALUES(6, 'SAVE', 3000, '깜짝 적립',  '2023-12-19', 1, '2022-12-19 03:32:34.015535');
-- INSERT INTO test.`point` (id, category, amount, breakdown, expiresin_date, user_id, created_at) VALUES(7, 'USE', -7000, '적립금 사용', '2023-12-19', 1, '2022-12-19 03:32:34.015535');

-- INSERT INTO test.`point_use` (id, point_id_use, point_id, amount, created_at) VALUES(1, 7, 2, 5000, CURRENT_TIMESTAMP(6));
-- INSERT INTO test.`point_use` (id, point_id_use, point_id, amount, created_at) VALUES(2, 7, 6, 2000, CURRENT_TIMESTAMP(6));
