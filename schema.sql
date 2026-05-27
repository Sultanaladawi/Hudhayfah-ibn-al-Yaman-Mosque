-- Database Schema for Hudhaifa Bin Al-Yaman Mosque Platform
-- Re-purposed graduation project database

CREATE DATABASE IF NOT EXISTS `graduation_project` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `graduation_project`;

-- 1. categories Table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `label` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. menu_items Table (Represents Mosque Programs / Donation Items in backend queries)
CREATE TABLE IF NOT EXISTS `menu_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `price_num` DECIMAL(10,2) DEFAULT NULL,
  `price_display` VARCHAR(50) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `tags` TEXT DEFAULT NULL,
  `available` TINYINT(1) DEFAULT 1,
  `image_url` VARCHAR(1024) DEFAULT NULL,
  `addons` TEXT DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. addons Table (Represents Custom Additions or options in Donation cart)
CREATE TABLE IF NOT EXISTS `addons` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10,2) DEFAULT 0.50,
  `inventory_id` INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. menu_item_addons Table
CREATE TABLE IF NOT EXISTS `menu_item_addons` (
  `menu_item_id` INT NOT NULL,
  `addon_id` INT NOT NULL,
  PRIMARY KEY (`menu_item_id`, `addon_id`),
  FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`addon_id`) REFERENCES `addons`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. menu_item_tags Table
CREATE TABLE IF NOT EXISTS `menu_item_tags` (
  `menu_item_id` INT NOT NULL,
  `tag_id` INT NOT NULL,
  PRIMARY KEY (`menu_item_id`, `tag_id`),
  FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. inventory Table (Represents Mosque supplies / resource stocks)
CREATE TABLE IF NOT EXISTS `inventory` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `item_name` VARCHAR(255) NOT NULL,
  `quantity` DECIMAL(10,2) DEFAULT 0.00,
  `unit` VARCHAR(50) DEFAULT NULL,
  `min_threshold` DECIMAL(10,2) DEFAULT 0.00,
  `calories_per_unit` DECIMAL(8,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. recipes Table (Links menu items to inventory items)
CREATE TABLE IF NOT EXISTS `recipes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `menu_item_id` INT NOT NULL,
  `inventory_id` INT NOT NULL,
  `quantity_required` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`inventory_id`) REFERENCES `inventory`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. orders Table (Represents donations and transactions)
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `status` VARCHAR(50) DEFAULT 'preparing',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `estimated_ready_at` DATETIME DEFAULT NULL,
  `order_type` VARCHAR(50) DEFAULT 'takeaway',
  `delivery_address` TEXT DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. order_items Table (Details of each item in a donation/order)
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT DEFAULT NULL,
  `item_name` VARCHAR(255) NOT NULL,
  `quantity` DECIMAL(10,2) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `menu_items`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. contact_messages Table (Contact queries from parents/public)
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `status` VARCHAR(50) DEFAULT 'new',
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. job_applications Table (Mosque volunteers applications)
CREATE TABLE IF NOT EXISTS `job_applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(60) DEFAULT NULL,
  `position` VARCHAR(255) DEFAULT NULL,
  `cover_letter` TEXT DEFAULT NULL,
  `resume_url` VARCHAR(1024) DEFAULT NULL,
  `status` VARCHAR(50) DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. careers Table (Volunteer positions / Mosque listings)
CREATE TABLE IF NOT EXISTS `careers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `type` VARCHAR(100) DEFAULT 'Full-time',
  `location` VARCHAR(255) DEFAULT 'As-Salt',
  `description` TEXT DEFAULT NULL,
  `active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. site_settings Table
CREATE TABLE IF NOT EXISTS `site_settings` (
  `key` VARCHAR(255) PRIMARY KEY,
  `value` TEXT,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. offers Table (Used for Honors / Student Honors board)
CREATE TABLE IF NOT EXISTS `offers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `product_name` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `reason` TEXT DEFAULT NULL,
  `discount_percent` DECIMAL(5,2) DEFAULT NULL,
  `end_date` DATE DEFAULT NULL,
  `active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. chat_messages Table (Public chat bot logs)
CREATE TABLE IF NOT EXISTS `chat_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_msg` TEXT DEFAULT NULL,
  `ai_msg` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. ai_assistant_messages Table (Admin assistant chatbot logs)
CREATE TABLE IF NOT EXISTS `ai_assistant_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `admin_query` TEXT DEFAULT NULL,
  `ai_response` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. ai_assistant_logs Table (Duplicate logs endpoint target)
CREATE TABLE IF NOT EXISTS `ai_assistant_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `admin_query` TEXT DEFAULT NULL,
  `ai_response` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. product_reviews Table
CREATE TABLE IF NOT EXISTS `product_reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `reviewer_name` VARCHAR(255) DEFAULT NULL,
  `comment` TEXT DEFAULT NULL,
  `rating` TINYINT(1) DEFAULT 5,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `menu_items`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. general_feedback Table
CREATE TABLE IF NOT EXISTS `general_feedback` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `reviewer_name` VARCHAR(255) DEFAULT 'Anonymous',
  `comment` TEXT DEFAULT NULL,
  `rating` TINYINT(1) DEFAULT 5,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. store_reviews Table
CREATE TABLE IF NOT EXISTS `store_reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `reviewer_name` VARCHAR(255) DEFAULT 'Anonymous',
  `comment` TEXT DEFAULT NULL,
  `rating` TINYINT(1) DEFAULT 5,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. ai_insights_cache Table
CREATE TABLE IF NOT EXISTS `ai_insights_cache` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `topic` VARCHAR(100) UNIQUE,
  `content` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 22. admin_logs Table (Audit Trail)
CREATE TABLE IF NOT EXISTS `admin_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `admin_email` VARCHAR(255) NOT NULL,
  `admin_name` VARCHAR(255) DEFAULT NULL,
  `action` VARCHAR(255) NOT NULL,
  `details` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==========================================
-- SEED INITIAL DATA FOR THE MOSQUE SYSTEM --
-- ==========================================

-- Seed Categories
INSERT INTO `categories` (`id`, `name`, `label`) VALUES
(1, 'حلقات القرآن', 'حلقات القرآن'),
(2, 'الأنشطة العامة', 'الأنشطة العامة'),
(3, 'دعم المسجد والتطوير', 'دعم المسجد والتطوير'),
(4, 'الصدقات والزكاة', 'الصدقات والزكاة')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `label`=VALUES(`label`);

-- Seed Default Programs/Items (Represented as menu_items in backend)
INSERT INTO `menu_items` (`id`, `category_id`, `name`, `price_num`, `price_display`, `description`, `available`, `sort_order`) VALUES
(1, 1, 'دعم حلقات تحفيظ القرآن الكريم للأشبال', 10.00, 'JOD 10.00', 'سهم كفالة طالب علم في حلقات التحفيظ الأسبوعية شامل المناهج والجوائز التشجيعية.', 1, 1),
(2, 1, 'سهم كفالة وتكريم معلم حلقة قرآنية', 50.00, 'JOD 50.00', 'دعم المعلمين والمحفظين المتطوعين لمواصلة تحفيظ كتاب الله لأبناء الحي.', 1, 2),
(3, 2, 'دعم النشاط الرياضي الأسبوعي ودوري كرة القدم للشباب', 15.00, 'JOD 15.00', 'تجهيز حجز الملعب الرياضي وشراء الجوائز والقمصان لدوري شباب المسجد.', 1, 3),
(4, 3, 'سهم كفالة أعمال صيانة المسجد والمرافق العامة', 20.00, 'JOD 20.00', 'المساهمة في صيانة مكيفات المسجد، نظام الصوت، شبكة المياه، وأعمال النظافة الدورية.', 1, 4),
(5, 3, 'سهم سقيا الماء للمصلين وضيافة المصلين في رمضان', 5.00, 'JOD 5.00', 'توفير كراتين المياه المبردة للمصلين طوال العام وفي صلاة التراويح والجمعة.', 1, 5),
(6, 4, 'صندوق الزكاة والصدقات لمساعدة الأسر العفيفة', 10.00, 'JOD 10.00', 'توزيع مبالغ نقدية وطرود غذائية للأسر المحتاجة والأرامل والمسجلين في لجان المسجد.', 1, 6)
ON DUPLICATE KEY UPDATE `category_id`=VALUES(`category_id`), `name`=VALUES(`name`), `price_num`=VALUES(`price_num`), `price_display`=VALUES(`price_display`), `description`=VALUES(`description`);

-- Seed Default Inventory ( supplies in Mosque context)
INSERT INTO `inventory` (`id`, `item_name`, `quantity`, `unit`, `min_threshold`, `calories_per_unit`) VALUES
(1, 'مياه معدنية مبردة (كرتونة)', 150.00, 'كرتونة', 20.00, 0.00),
(2, 'مصاحف برواية حفص عن عاصم (طبعة المدينة)', 300.00, 'نسخة', 50.00, 0.00),
(3, 'كتيبات القاعدة النورانية وحصن المسلم', 200.00, 'كتيب', 30.00, 0.00),
(4, 'جوائز ودروع تكريمية للطلاب', 75.00, 'درع/جائزة', 10.00, 0.00),
(5, 'مواد تعقيم وتنظيف السجاد والأرفف', 40.00, 'عبوة', 5.00, 0.00),
(6, 'أقلام سبورة ودفاتر متابعة للحلقات', 120.00, 'قطعة', 15.00, 0.00);

-- Seed Addons (Extra choices during checkout/cart)
INSERT INTO `addons` (`id`, `name`, `price`, `inventory_id`) VALUES
(1, 'إضافة وجبة إفطار لطالب حلقة', 2.50, NULL),
(2, 'إرفاق بطاقة إهداء أو كفالة باسم شخص متوفى', 0.00, NULL),
(3, 'دعم إضافي لكسوة العيد لليتيم كفالة كاملة', 15.00, NULL);

-- Seed Site Settings
INSERT INTO `site_settings` (`key`, `value`) VALUES
('store_status', 'auto')
ON DUPLICATE KEY UPDATE `value`=VALUES(`value`);

-- Seed Default Careers/Volunteer fields
INSERT INTO `careers` (`id`, `title`, `type`, `location`, `description`, `active`) VALUES
(1, 'محفظ قرآن متطوع (ذكور)', 'جزئي / تطوعي', 'طبربور، عمان', 'تحفيظ كتاب الله لطلاب الحلقات بعد العصر أو بعد الفجر ومتابعة حفظهم وتجويدهم.', 1),
(2, 'مشرف نشاط رياضي ورحلات شبابية', 'جزئي / تطوعي', 'طبربور، عمان', 'تنظيم وتجهيز دوري كرة القدم الأسبوعي والرحلات الترفيهية لطلاب الحلقات والشباب.', 1),
(3, 'منظم فعاليات ومناسبات دينية بالمسجد', 'جزئي / تطوعي', 'طبربور، عمان', 'المساعدة في تنظيم مصلى الجمعة والتراويح، والمناسبات والمسابقات السنوية.', 1)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`), `type`=VALUES(`type`), `location`=VALUES(`location`), `description`=VALUES(`description`);

-- Seed Initial Admin User logs
INSERT INTO `admin_logs` (`admin_email`, `admin_name`, `action`, `details`) VALUES
('admin@huzaifa.org', 'الشيخ أسامة الجلودي', 'تهيئة النظام', 'تم تهيئة وتحديث لوحة تحكم مسجد حذيفة بن اليمان بنجاح وبدء تفعيل ربط قواعد البيانات.'),
('admin@huzaifa.org', 'الشيخ أسامة الجلودي', 'مزامنة الحلقات', 'تم مزامنة الحلقات القرآنية الست وجداول حضور الطلاب والتحقق من سير الأنشطة.');
