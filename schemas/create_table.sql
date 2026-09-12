SET
    FOREIGN_KEY_CHECKS = 0;
    -- Table structure for subscription (deenbot.sqlite)
DROP TABLE IF EXISTS
    `subscription`;
CREATE TABLE `subscription`(
    `chat_id` TEXT,
    `daily_quote` BOOLEAN,
    `daily_verse` BOOLEAN
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Table structure for general_subscription (deenbot.sqlite)
DROP TABLE IF EXISTS
    `general_subscription`;
CREATE TABLE `general_subscription`(
    `_id` INT AUTO_INCREMENT,
    `subscriber` TEXT NOT NULL,
    PRIMARY KEY(`_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Table structure for favorites (deenbot.sqlite)
DROP TABLE IF EXISTS
    `favorites`;
CREATE TABLE `favorites`(
    `_id` INT AUTO_INCREMENT,
    `sub_id` TEXT NOT NULL,
    `ftype` TEXT NOT NULL,
    `content` TEXT NOT NULL,
    `added_on` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Table structure for daily_subscription (deenbot.sqlite)
DROP TABLE IF EXISTS
    `daily_subscription`;
CREATE TABLE `daily_subscription`(
    `_id` INT AUTO_INCREMENT,
    `subscriber_id` TEXT NOT NULL,
    `daily_quote` BOOLEAN,
    `daily_verse` BOOLEAN,
    PRIMARY KEY(`_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Table structure for users (deenbot.sqlite)
DROP TABLE IF EXISTS
    `users`;
CREATE TABLE `users`(
    `id` INT AUTO_INCREMENT,
    `username` TEXT,
    `email` TEXT,
    `password` TEXT,
    `settings` TEXT,
    `bookmarks` TEXT,
    `favorites` TEXT,
    PRIMARY KEY(`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Table structure for prayer_logs (deenbot.sqlite)
DROP TABLE IF EXISTS
    `prayer_logs`;
CREATE TABLE `prayer_logs`(
    `id` INT AUTO_INCREMENT,
    `username` TEXT,
    `date` TEXT,
    `prayer_name` TEXT,
    `status` INT DEFAULT 0,
    PRIMARY KEY(`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Table structure for prayer_timings (prayers.sqlite)
DROP TABLE IF EXISTS
    `prayer_timings`;
CREATE TABLE `prayer_timings`(
    `id` INT AUTO_INCREMENT,
    `date` TEXT,
    `city` TEXT,
    `country` TEXT,
    `method` INT,
    `fajr` TEXT,
    `sunrise` TEXT,
    `dhuhr` TEXT,
    `asr` TEXT,
    `maghrib` TEXT,
    `isha` TEXT,
    PRIMARY KEY(`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Table structure for Bab (quotes.sqlite)
DROP TABLE IF EXISTS
    `Bab`;
CREATE TABLE `Bab`(
    `_id` INT NOT NULL AUTO_INCREMENT,
    `artitle` VARCHAR(255) NOT NULL,
    `entitle` VARCHAR(255),
    `Qsm` INT,
    PRIMARY KEY(`_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Table structure for Fsl (quotes.sqlite)
DROP TABLE IF EXISTS
    `Fsl`;
CREATE TABLE `Fsl`(
    `_id` INT NOT NULL AUTO_INCREMENT,
    `artitle` VARCHAR(255) NOT NULL,
    `entitle` VARCHAR(255),
    `Bab` INT,
    `topicmatchname` VARCHAR(255) NOT NULL,
    PRIMARY KEY(`_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Table structure for Qsm (quotes.sqlite)
DROP TABLE IF EXISTS
    `Qsm`;
CREATE TABLE `Qsm`(
    `_id` INT NOT NULL AUTO_INCREMENT,
    `artitle` VARCHAR(255) NOT NULL,
    `entitle` VARCHAR(255) NOT NULL,
    PRIMARY KEY(`_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Table structure for Source (quotes.sqlite)
DROP TABLE IF EXISTS
    `Source`;
CREATE TABLE `Source`(
    `_id` INT NOT NULL,
    `artitle` VARCHAR(255) NOT NULL,
    `entitle` VARCHAR(255)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Table structure for Topic (quotes.sqlite)
DROP TABLE IF EXISTS
    `Topic`;
CREATE TABLE `Topic`(
    `_id` INT NOT NULL AUTO_INCREMENT,
    `artitle` VARCHAR(255) NOT NULL,
    `entitle` VARCHAR(255) DEFAULT NULL,
    `Fsl` VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY(`_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Table structure for words (quotes.sqlite)
DROP TABLE IF EXISTS
    `words`;
CREATE TABLE `words`(
    `_id` INT(255) NOT NULL,
    `BookId` INT(255) NOT NULL,
    `Wisdom` TEXT NOT NULL,
    `enWisdom` TEXT,
    `Qsm` VARCHAR(255) NOT NULL,
    `Bab` VARCHAR(255) NOT NULL,
    `Fsl` VARCHAR(255) NOT NULL,
    `Topic` VARCHAR(255) NOT NULL,
    `Source` VARCHAR(255) NOT NULL,
    `fav` INT(55) NOT NULL DEFAULT '0',
    `lastcheckdate` VARCHAR(255),
    PRIMARY KEY(`_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Table structure for surahs (quran.sqlite)
DROP TABLE IF EXISTS
    `surahs`;
CREATE TABLE `surahs`(
    `id` INT AUTO_INCREMENT,
    `name_simple` TEXT,
    `name_arabic` TEXT,
    `verses_count` INT,
    PRIMARY KEY(`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Table structure for ayahs (quran.sqlite)
DROP TABLE IF EXISTS
    `ayahs`;
CREATE TABLE `ayahs`(
    `id` INT AUTO_INCREMENT,
    `surah_number` INT,
    `verse_number` INT,
    `text_uthmani` TEXT,
    `verse_key` TEXT,
    PRIMARY KEY(`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Table structure for translations (quran.sqlite)
DROP TABLE IF EXISTS
    `translations`;
CREATE TABLE `translations`(
    `id` INT AUTO_INCREMENT,
    `name` TEXT,
    `language_name` TEXT,
    `author_name` TEXT,
    PRIMARY KEY(`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Table structure for tafsirs (quran.sqlite)
DROP TABLE IF EXISTS
    `tafsirs`;
CREATE TABLE `tafsirs`(
    `id` INT AUTO_INCREMENT,
    `name` TEXT,
    `language_name` TEXT,
    `author_name` TEXT,
    PRIMARY KEY(`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Table structure for ayah_translations (quran.sqlite)
DROP TABLE IF EXISTS
    `ayah_translations`;
CREATE TABLE `ayah_translations` (
    `verse_key` VARCHAR(20) NOT NULL,
    `translation_id` INT NOT NULL,
    `text` TEXT NOT NULL,
    PRIMARY KEY (`verse_key`, `translation_id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- Table structure for ayah_tafsirs (quran.sqlite)
DROP TABLE IF EXISTS
    `ayah_tafsirs`;
CREATE TABLE `ayah_tafsirs`(
    `verse_key` VARCHAR(20) NOT NULL,
    `tafsir_id` INT,
    `text` LONGTEXT,
    PRIMARY KEY(`verse_key`, `tafsir_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci; SET
    FOREIGN_KEY_CHECKS = 1;