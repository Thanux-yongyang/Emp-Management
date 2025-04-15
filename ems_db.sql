-- MySQL dump 10.13  Distrib 8.3.0, for Win64 (x86_64)
--
-- Host: localhost    Database: ems_db
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `employee_tbl`
--

DROP TABLE IF EXISTS `employee_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_tbl` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) NOT NULL,
  `date_of_birth` date NOT NULL,
  `date_of_entry` date NOT NULL,
  `department` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `phone_no` varchar(255) NOT NULL,
  `postal_code` varchar(255) NOT NULL,
  `sub_address` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKnvjyo0poltptgsirwjbu87w9t` (`phone_no`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_tbl`
--

LOCK TABLES `employee_tbl` WRITE;
/*!40000 ALTER TABLE `employee_tbl` DISABLE KEYS */;
INSERT INTO `employee_tbl` VALUES (15,'東京都千代田区千代田1-1','1990-06-11','2023-03-14','HR','haruto.sato@hrcompany.com','Haruto','male','Sato','080-2345-6789','100-0001','丸の内ビルディング 5F'),(16,'東京都渋谷区神宮前1-15-10','1985-02-24','2021-09-09','Marketing','miyuki.tanaka@marketing.com','Miyuki','female','Tanaka','070-1234-5678','150-0001','渋谷スクエアビル 2F'),(17,'東京都渋谷区桜丘町23-8','1992-11-07','2020-05-02','Finance','kento.yamamoto@financeco.com','Kento','male','Yamamoto','090-2345-7890','150-0031','渋谷ヒカリエ 4F'),(18,'東京都新宿区新宿1-2-3','1995-09-13','2024-01-24','Sales','emi.nakamura@salescorp.com','Emi','female','Nakamura','080-3456-7890','160-0022','新宿パークタワー 6F'),(19,'大阪府大阪市北区梅田1-1-1','1989-07-01','2022-03-09','Operations','ryo.fujita@operationsco.com','Ryo','male','Fujita','090-4567-1234','530-0001','大阪ステーションビル 8F'),(20,'宮城県仙台市青葉区中央2-5-1','1993-04-15','2023-07-19','Customer Support','aya.kobayashi@customersupport.com','Aya','female','Kobayashi','080-6789-2345','984-0011','仙台タワー 7F'),(24,'大阪府大阪市西区江戸堀1-9-3','1997-01-24','2024-04-17','Research & Development','yuki.shimizu@rdcompany.com','Yuki','female','Shimizu','070-3456-7890','550-0001','大阪シティタワー 4F'),(25,'香川県高松市亀井町1-8','1994-05-11','2023-11-24','Finance','tomo.yoshida@financecorp.com','Tomo','male','Yoshida','090-1234-9876','760-0023','高松タワー 2F');
/*!40000 ALTER TABLE `employee_tbl` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-27 21:47:17
