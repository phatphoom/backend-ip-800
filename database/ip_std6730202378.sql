-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 03, 2026 at 01:35 PM
-- Server version: 8.0.46-0ubuntu0.24.04.4
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ip_std6730202378`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `cate_id` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cate_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`cate_id`, `cate_name`, `image_url`, `created_at`, `updated_at`, `deleted_at`) VALUES
('cate_001', 'Home & Living', '/uploads/products/1788361067345-778764240.jpg', '2026-07-25 20:09:06', '2026-09-03 00:31:17', NULL),
('cate_002', 'Electronics', '/uploads/products/1788402214604-130992816.jpg', '2026-07-25 20:09:06', '2026-09-03 09:23:34', NULL),
('cate_003', 'Fashion', '/uploads/products/1788401967583-59467195.jpg', '2026-07-25 20:09:06', '2026-09-03 09:19:27', NULL),
('cate_004', 'Lighting & Decor', '', '2026-07-25 20:09:06', '2026-09-03 00:31:17', NULL),
('cate_005', 'dsadasd', NULL, '2026-09-03 01:27:03', '2026-09-03 01:27:03', '2026-09-03 01:39:45'),
('cate_006', 'aa', NULL, '2026-09-03 01:33:47', '2026-09-03 01:33:47', '2026-09-03 01:39:26'),
('cate_007', 'test edit test', NULL, '2026-09-03 01:37:08', '2026-09-03 01:37:08', '2026-09-03 01:39:38');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `prod_id` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prod_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `currency` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'THB',
  `cate_id` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `in_stock` tinyint(1) NOT NULL,
  `stock_count` int UNSIGNED NOT NULL DEFAULT '0',
  `discount_pct` decimal(10,0) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`prod_id`, `prod_name`, `description`, `price`, `currency`, `cate_id`, `image_url`, `in_stock`, `stock_count`, `discount_pct`, `created_at`, `updated_at`, `deleted_at`) VALUES
('prod_0001', 'Modern Wooden Desk Lamp nindam', 'Adjustable wooden table lamp with warm lighting, perfect for study and office spaces.', 550, 'THB', 'cate_002', 'https://images.unsplash.com/photo-1551380701-5dd33d5b5d06?w=500', 1, 15, 20, '2026-07-25 19:55:33', '2026-09-03 09:55:03', '2026-09-03 09:55:38'),
('prod_0002', 'Minimalist Globe Table Lamp', 'Compact round orb table lamp with warm ambient light and wooden base.', 289, 'THB', 'cate_003', '/uploads/products/1788361040132-598600639.jpg', 1, 50, 15, '2026-07-25 20:10:45', '2026-09-02 21:57:20', NULL),
('prod_0003', 'Kucast', 'kucast lamp', 555, 'THB', 'cate_001', '/uploads/products/1788404186364-738527238.jpg', 1, 10, 10, '2026-09-03 09:56:26', '2026-09-03 09:56:26', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
('user_0001', 'test', 'test@gmail.com', '$2b$10$4GaipGYrKGDWeovEbK/xZO6uKU7koCm8ZVXQ2mU/c0WMW.id6gTdq', 'user', '2026-08-06 05:25:38', '2026-08-06 05:25:38'),
('user_0002', 'admin', 'admin', '$2b$10$KwB4ErUx2e39/4D3nQcIQ.elGyWcR3lBVh9c9DZMO/tpKmEW0CRvm', 'admin', '2026-08-06 05:51:48', '2026-08-13 04:58:00'),
('user_0004', 'test2', 'test2@gmail.com', '$2b$10$WE0w4ojwDHsPgf/hJ71G..oTrukHj9eybDbCIQYBr7VFKLIlrTClG', 'user', '2026-08-26 13:50:27', '2026-08-26 13:50:27');

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `user_id` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_profiles`
--

INSERT INTO `user_profiles` (`user_id`, `first_name`, `last_name`, `phone_number`, `avatar_url`, `address`, `created_at`, `updated_at`) VALUES
('user_0001', NULL, NULL, '083927174', '/uploads/products/1787798314314-55137132.jpg', 'Japan', '2026-08-26 10:22:06', '2026-09-03 02:25:12'),
('user_0004', NULL, NULL, NULL, NULL, NULL, '2026-08-26 13:50:27', '2026-08-26 13:50:27');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`cate_id`),
  ADD UNIQUE KEY `cate_name` (`cate_name`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`prod_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
