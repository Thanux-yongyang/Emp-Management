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
-- Table structure for table `attendance_detail_tbl`
--

DROP TABLE IF EXISTS `attendance_detail_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_detail_tbl` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `attend_date` date NOT NULL,
  `break_time` double NOT NULL,
  `clockin_time` datetime DEFAULT NULL,
  `clockout_time` datetime(6) DEFAULT NULL,
  `over_time` double NOT NULL,
  `total_time` double NOT NULL,
  `emp_id` bigint NOT NULL,
  `is_paid_leave` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKdtdqnlvqwmyy5irrptmed574i` (`emp_id`),
  CONSTRAINT `FKdtdqnlvqwmyy5irrptmed574i` FOREIGN KEY (`emp_id`) REFERENCES `employee_tbl` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=152 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_detail_tbl`
--

LOCK TABLES `attendance_detail_tbl` WRITE;
/*!40000 ALTER TABLE `attendance_detail_tbl` DISABLE KEYS */;
INSERT INTO `attendance_detail_tbl` VALUES (4,'2025-07-31',1,'2025-08-05 14:01:55','2025-08-05 23:36:00.111000',0.57,8.57,15,_binary '\0'),(37,'2025-08-01',1,'2025-08-01 00:00:00','2025-08-01 09:00:00.000000',0,8,15,_binary '\0'),(38,'2025-08-02',1,'2025-08-02 01:00:00','2025-08-02 10:15:00.000000',0,8.25,15,_binary '\0'),(39,'2025-08-03',1,'2025-08-05 08:55:00','2025-08-05 17:50:00.000000',0.83,7.83,15,_binary '\0'),(40,'2025-08-04',1,'2025-08-05 09:05:00','2025-08-05 18:10:00.000000',1.08,8.08,15,_binary '\0'),(41,'2025-08-01',1,'2025-08-05 08:50:00','2025-08-05 17:45:00.000000',0.75,7.75,16,_binary '\0'),(42,'2025-08-02',1,'2025-08-05 09:05:00','2025-08-05 18:10:00.000000',1,8,16,_binary '\0'),(43,'2025-08-03',1,'2025-08-05 09:00:00','2025-08-05 18:05:00.000000',1.08,8.08,16,_binary '\0'),(44,'2025-08-04',1,'2025-08-05 08:55:00','2025-08-05 17:50:00.000000',0.83,7.83,16,_binary '\0'),(45,'2025-08-01',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',1,8,17,_binary '\0'),(46,'2025-08-02',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',1,8,17,_binary '\0'),(47,'2025-08-03',1,'2025-08-05 09:10:00','2025-08-05 18:15:00.000000',1.08,8.08,17,_binary '\0'),(48,'2025-08-04',1,'2025-08-05 09:05:00','2025-08-05 18:10:00.000000',1.08,8.08,17,_binary '\0'),(49,'2025-08-01',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',1,8,18,_binary '\0'),(50,'2025-08-02',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',1,8,18,_binary '\0'),(51,'2025-08-03',1,'2025-08-05 09:10:00','2025-08-05 18:10:00.000000',1,8,18,_binary '\0'),(52,'2025-08-04',1,'2025-08-05 08:55:00','2025-08-05 17:50:00.000000',0.83,7.83,18,_binary '\0'),(53,'2025-08-01',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',1,8,19,_binary '\0'),(54,'2025-08-02',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',1,8,19,_binary '\0'),(55,'2025-08-03',1,'2025-08-05 09:05:00','2025-08-05 18:00:00.000000',0.92,7.92,19,_binary '\0'),(56,'2025-08-04',1,'2025-08-05 09:00:00','2025-08-05 18:05:00.000000',1.08,8.08,19,_binary '\0'),(57,'2025-08-01',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',1,8,20,_binary '\0'),(58,'2025-08-02',1,'2025-08-05 09:10:00','2025-08-05 18:15:00.000000',1.08,8.08,20,_binary '\0'),(59,'2025-08-03',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',1,8,20,_binary '\0'),(60,'2025-08-04',1,'2025-08-05 08:55:00','2025-08-05 17:55:00.000000',0.83,7.83,20,_binary '\0'),(61,'2025-08-01',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',1,8,24,_binary '\0'),(62,'2025-08-02',1,'2025-08-05 09:05:00','2025-08-05 18:10:00.000000',1,8,24,_binary '\0'),(63,'2025-08-03',1,'2025-08-05 09:00:00','2025-08-05 18:05:00.000000',1.08,8.08,24,_binary '\0'),(64,'2025-08-04',1,'2025-08-05 08:55:00','2025-08-05 17:50:00.000000',0.83,7.83,24,_binary '\0'),(65,'2025-08-01',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',1,8,25,_binary '\0'),(66,'2025-08-02',1,'2025-08-05 09:10:00','2025-08-05 18:15:00.000000',1.08,8.08,25,_binary '\0'),(67,'2025-08-03',1,'2025-08-05 09:05:00','2025-08-05 18:10:00.000000',1.08,8.08,25,_binary '\0'),(68,'2025-08-04',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',1,8,25,_binary '\0'),(69,'2025-07-01',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(70,'2025-07-01',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(71,'2025-07-02',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(72,'2025-07-02',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(73,'2025-07-03',1,'2025-08-05 09:00:00','2025-08-05 19:00:00.000000',1,9,16,_binary '\0'),(74,'2025-07-03',1,'2025-08-05 09:00:00','2025-08-05 19:00:00.000000',1,9,15,_binary '\0'),(75,'2025-07-04',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(76,'2025-07-04',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(77,'2025-07-05',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(78,'2025-07-05',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(79,'2025-07-06',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(80,'2025-07-06',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(81,'2025-07-07',1,'2025-08-05 09:00:00','2025-08-05 19:00:00.000000',1,9,16,_binary '\0'),(82,'2025-07-07',1,'2025-08-05 09:00:00','2025-08-05 19:00:00.000000',1,9,15,_binary '\0'),(83,'2025-07-08',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(84,'2025-07-08',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(85,'2025-07-09',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(86,'2025-07-09',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(87,'2025-07-10',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(88,'2025-07-10',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(89,'2025-07-11',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(90,'2025-07-11',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(91,'2025-07-12',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(92,'2025-07-12',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(93,'2025-07-13',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(94,'2025-07-13',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(95,'2025-07-14',1,'2025-08-05 09:00:00','2025-08-05 19:00:00.000000',1,9,16,_binary '\0'),(96,'2025-07-14',1,'2025-08-05 09:00:00','2025-08-05 19:00:00.000000',1,9,15,_binary '\0'),(97,'2025-07-15',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(98,'2025-07-15',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(99,'2025-07-16',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(100,'2025-07-16',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(101,'2025-07-17',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(102,'2025-07-17',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(103,'2025-07-18',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(104,'2025-07-18',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(105,'2025-07-19',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(106,'2025-07-19',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(107,'2025-07-20',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(108,'2025-07-20',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(109,'2025-07-21',1,'2025-08-05 09:00:00','2025-08-05 19:00:00.000000',1,9,16,_binary '\0'),(110,'2025-07-21',1,'2025-08-05 09:00:00','2025-08-05 19:00:00.000000',1,9,15,_binary '\0'),(111,'2025-07-22',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(112,'2025-07-22',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(113,'2025-07-23',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(114,'2025-07-23',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(115,'2025-07-24',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(116,'2025-07-24',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(117,'2025-07-25',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(118,'2025-07-25',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(119,'2025-07-26',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(120,'2025-07-26',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(121,'2025-07-27',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(122,'2025-07-27',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(123,'2025-07-28',1,'2025-08-05 09:00:00','2025-08-05 19:00:00.000000',1,9,16,_binary '\0'),(124,'2025-07-28',1,'2025-08-05 09:00:00','2025-08-05 19:00:00.000000',1,9,15,_binary '\0'),(125,'2025-07-29',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(126,'2025-07-29',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(127,'2025-07-30',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(128,'2025-07-30',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(129,'2025-07-31',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,16,_binary '\0'),(130,'2025-07-31',1,'2025-08-05 09:00:00','2025-08-05 18:00:00.000000',0,8,15,_binary '\0'),(132,'2025-08-07',1,'2025-08-07 09:00:00','2025-08-07 19:00:00.000000',1,9,15,_binary '\0'),(133,'2025-08-07',1,'2025-08-07 09:00:00','2025-08-07 19:00:00.000000',1,9,16,_binary '\0'),(134,'2025-08-06',1,'2025-08-06 09:00:00','2025-08-06 19:00:00.000000',1,9,15,_binary '\0'),(135,'2025-08-06',1,'2025-08-06 09:00:00','2025-08-06 19:00:00.000000',1,9,16,_binary '\0'),(136,'2025-08-05',1,'2025-08-05 09:00:00','2025-08-05 19:00:00.000000',1,9,15,_binary '\0'),(137,'2025-08-05',1,'2025-08-05 09:00:00','2025-08-05 19:00:00.000000',1,9,16,_binary '\0'),(138,'2025-08-09',1,'2025-08-07 09:00:00','2025-08-07 19:00:00.000000',1,9,15,_binary '\0'),(139,'2025-08-09',1,'2025-08-07 09:00:00','2025-08-07 19:00:00.000000',1,9,16,_binary '\0'),(140,'2025-08-10',1,'2025-08-06 09:00:00','2025-08-06 19:00:00.000000',1,9,15,_binary '\0'),(141,'2025-08-10',1,'2025-08-06 09:00:00','2025-08-06 19:00:00.000000',1,9,16,_binary '\0'),(143,'2025-08-11',1,'2025-08-05 09:00:00','2025-08-05 19:00:00.000000',1,9,16,_binary '\0'),(144,'2025-08-11',1,'2025-08-11 06:36:00','2025-08-11 10:10:00.000000',0,2.57,15,_binary '\0'),(150,'2025-08-08',0,NULL,NULL,0,0,15,_binary ''),(151,'2025-06-02',0,NULL,NULL,0,0,15,_binary '');
/*!40000 ALTER TABLE `attendance_detail_tbl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendancelogin_tbl`
--

DROP TABLE IF EXISTS `attendancelogin_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendancelogin_tbl` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `login_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `emp_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKlbf1rgv3r4goh9h5cvmtn8jkj` (`login_name`),
  KEY `FK83gwm6rcs7v5e4wr6xdtfqk1q` (`emp_id`),
  CONSTRAINT `FK83gwm6rcs7v5e4wr6xdtfqk1q` FOREIGN KEY (`emp_id`) REFERENCES `employee_tbl` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendancelogin_tbl`
--

LOCK TABLES `attendancelogin_tbl` WRITE;
/*!40000 ALTER TABLE `attendancelogin_tbl` DISABLE KEYS */;
INSERT INTO `attendancelogin_tbl` VALUES (3,'Haruto15','$2a$10$8o4dgtbRX9rVFjfntR7BLuPD9VzkMDFNe/M3RDvczQ7GhtFB.XQuS',15),(4,'Miyuki16','$2a$10$yOwVNwHUethZi7L0PAF8lugh9D7I2seK7ulxvq.MshFajsIqOAcb2',16),(5,'Kento17','$2a$10$c61BvsLXywvhtklpPLTWNuOmVbI7t0W02XDInat98j2BAnZXFyBMe',17),(6,'Emi18','$2a$10$ClBFTXA2T.DhqsNJ3eL7uOBghjiN0xr2HtNnJZNzjEGPptTERZy6m',18),(7,'Ryo19','$2a$10$DWrBHkcgGQWmNDM9dcyse.vN4.5ycrWKUBjk3lBh3Gq3jllA//qfK',19),(8,'Aya20','$2a$10$tu1pryKZCqp7rAPJ62EnrO3bZBEy/6HFWmWPwwii0gFxDxJHAVeCC',20),(9,'Yuki24','$2a$10$CFiQvWJH0.odXeLxwOkT4u65.H/CV1xdDSaGtA1v36r5UxN9UEoqm',24),(10,'Tomo25','$2a$10$BorV.fhzHtDzOiRNoAJb2.24V94gseHlfXaJyAzq9Gk4oys2mnPAa',25);
/*!40000 ALTER TABLE `attendancelogin_tbl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `department_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES (1,'Admin'),(2,'HR'),(3,'Sales'),(4,'Finance'),(5,'Research/Development'),(6,'Control Design'),(7,'Mechanical Design'),(8,'Manufacture'),(10,'test'),(11,'tes2');
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

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
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `phone_no` varchar(255) NOT NULL,
  `postal_code` varchar(255) NOT NULL,
  `sub_address` varchar(255) NOT NULL,
  `department_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKnvjyo0poltptgsirwjbu87w9t` (`phone_no`),
  KEY `FKh6dyy44909jybdahu93ff3xto` (`department_id`),
  CONSTRAINT `FKh6dyy44909jybdahu93ff3xto` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_tbl`
--

LOCK TABLES `employee_tbl` WRITE;
/*!40000 ALTER TABLE `employee_tbl` DISABLE KEYS */;
INSERT INTO `employee_tbl` VALUES (15,'東京都千代田区千代田1-1','1990-06-09','2023-03-12','haruto.sato@hrcompany.com','Haruto','male','Sato','080-2345-6789','100-0001','丸の内ビルディング 5F',1),(16,'東京都渋谷区神宮前1-15-10','1985-02-21','2021-09-06','miyuki.tanaka@marketing.com','Miyuki','female','Tanaka','070-1234-5678','150-0001','渋谷スクエアビル 2F',5),(17,'東京都渋谷区桜丘町23-8','1992-11-06','2020-05-01','kento.yamamoto@financeco.com','Kento','male','Yamamoto','090-2345-7890','150-0031','渋谷ヒカリエ 4F',3),(18,'東京都新宿区新宿1-2-3','1995-09-12','2024-01-23','emi.nakamura@salescorp.com','Emi','female','Nakamura','080-3456-7890','160-0022','新宿パークタワー 6F',3),(19,'大阪府大阪市北区梅田1-1-1','1989-06-30','2022-03-08','ryo.fujita@operationsco.com','Ryo','male','Fujita','090-4567-1234','530-0001','大阪ステーションビル 8F',3),(20,'宮城県仙台市青葉区中央2-5-1','1993-04-14','2023-07-18','aya.kobayashi@customersupport.com','Aya','female','Kobayashi','080-6789-2345','984-0011','仙台タワー 7F',3),(24,'大阪府大阪市西区江戸堀1-9-3','1997-01-23','2024-04-16','yuki.shimizu@rdcompany.com','Yuki','female','Shimizu','070-3456-7890','550-0001','大阪シティタワー 4F',3),(25,'香川県高松市亀井町1-8','1994-05-10','2023-11-23','tomo.yoshida@financecorp.com','Tomo','male','Yoshida','090-1234-9876','760-0023','高松タワー 2F',3),(36,'東京都 千代田区 千代田','2004-03-24','2025-08-01','sakuratanaka@gmail.com','さくら','female','たなか','345-2345-2345','100-0001','Leopalace 205号',3);
/*!40000 ALTER TABLE `employee_tbl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empsalary_tbl`
--

DROP TABLE IF EXISTS `empsalary_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empsalary_tbl` (
  `sal_id` bigint NOT NULL AUTO_INCREMENT,
  `account_number` varchar(255) DEFAULT NULL,
  `account_type` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `base_salary` double DEFAULT NULL,
  `bonus_allowance` double DEFAULT NULL,
  `branch_name` varchar(255) DEFAULT NULL,
  `communication_allowance` double DEFAULT NULL,
  `effective_date` date DEFAULT NULL,
  `emp_id` bigint NOT NULL,
  `employment_insurance` double DEFAULT NULL,
  `health_insurance` double DEFAULT NULL,
  `housing_allowance` double DEFAULT NULL,
  `income_tax` double DEFAULT NULL,
  `longterm_care` double DEFAULT NULL,
  `meal_allowance` double DEFAULT NULL,
  `net_salary` double DEFAULT NULL,
  `other_deduction` double DEFAULT NULL,
  `overtime_allowance` double DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `pension_insurance` double DEFAULT NULL,
  `salary_type` varchar(255) DEFAULT NULL,
  `total_allowance` double DEFAULT NULL,
  `total_deduction` double DEFAULT NULL,
  `transport_allowance` double DEFAULT NULL,
  PRIMARY KEY (`sal_id`),
  KEY `FKow4xx7j5cerk2xx8cpi9a5v9p` (`emp_id`),
  CONSTRAINT `FKow4xx7j5cerk2xx8cpi9a5v9p` FOREIGN KEY (`emp_id`) REFERENCES `employee_tbl` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empsalary_tbl`
--

LOCK TABLES `empsalary_tbl` WRITE;
/*!40000 ALTER TABLE `empsalary_tbl` DISABLE KEYS */;
INSERT INTO `empsalary_tbl` VALUES (1,'80347534','Savings','JP Yucho',239994,30000,'Fukuoka Branch',5000,'2025-08-01',15,1500,15000,15000,5000,0,5000,288494,0,20000,'Bank Transfer',15000,'Monthly',85000,36500,10000),(2,'80347534','Savings','JP Yucho',250000,22000,'Fukuoka Branch',5000,'2025-09-01',15,10000,5000,10000,10000,6000,4000,276000,0,22000,'Bank Transfer',10000,'Monthly',67000,41000,4000),(3,'80347534','Savings','JP Yucho',230000,50000,'Fukuoka Branch',4000,'2025-08-01',16,13000,9000,12000,12000,3000,5000,265000,0,5000,'Bank Transfer',9000,'Monthly',81000,46000,5000),(4,'80347534','Savings','JP Yucho',300000,20000,'Fukuoka Branch',13000,'2025-09-01',16,900,14850,12000,24375,1725,5000,289850,0,5000,'Bank Transfer',27300,'Monthly',59000,69150,4000),(5,'80347534','Savings','JP Yucho',190000,56000,'Fukuoka Branch',10000,'2025-10-01',15,15000,20000,8000,6000,2000,5000,239000,3000,20000,'Bank Transfer',6000,'Monthly',101000,52000,2000),(6,'1234567890','Savings','MUFG Bank',400000,80000,'Shinjuku Branch',10000,'2025-07-01',15,15000,35000,50000,70000,10000,15000,435000,5000,30000,'Bank Transfer',30000,'Monthly',195000,160000,20000);
/*!40000 ALTER TABLE `empsalary_tbl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login_tbl`
--

DROP TABLE IF EXISTS `login_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_tbl` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKjigcq8ubd7q8tj1f3s64bs4jg` (`email`),
  UNIQUE KEY `UKdh31ekma9xh7ar8v3a6sapm6e` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_tbl`
--

LOCK TABLES `login_tbl` WRITE;
/*!40000 ALTER TABLE `login_tbl` DISABLE KEYS */;
INSERT INTO `login_tbl` VALUES (1,'testuser@example.com','admin','admin','admin');
/*!40000 ALTER TABLE `login_tbl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paid_leave_tbl`
--

DROP TABLE IF EXISTS `paid_leave_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paid_leave_tbl` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `total_leave_days` int NOT NULL,
  `used_leave_days` int NOT NULL,
  `employee_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKr9wdkuua1h4i35n54kyy44p87` (`employee_id`),
  CONSTRAINT `FKf8pg80twru3v17f8r9it350yq` FOREIGN KEY (`employee_id`) REFERENCES `employee_tbl` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paid_leave_tbl`
--

LOCK TABLES `paid_leave_tbl` WRITE;
/*!40000 ALTER TABLE `paid_leave_tbl` DISABLE KEYS */;
INSERT INTO `paid_leave_tbl` VALUES (1,10,2,15),(2,10,0,16),(3,10,0,17),(4,10,0,18),(5,10,0,19),(6,10,0,20),(7,10,0,36),(8,10,0,25),(9,10,0,24);
/*!40000 ALTER TABLE `paid_leave_tbl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_tbl`
--

DROP TABLE IF EXISTS `user_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_tbl` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `employeeid` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKi4ygcc30htflmb5xe5mjcydid` (`email`),
  UNIQUE KEY `UKxkjl2orevvtyrqqshcot355j` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_tbl`
--

LOCK TABLES `user_tbl` WRITE;
/*!40000 ALTER TABLE `user_tbl` DISABLE KEYS */;
INSERT INTO `user_tbl` VALUES (10,'haruto.sato@hrcompany.com','$2a$10$Jzf9rxHnd.gPxnKCt1mrKuMFcV03XOmp9V1oU5Ninopa5fA4pFt/u','general','Haruto',15),(12,'kento.yamamoto@financeco.com','$2a$10$GbrEZi.qmhsbMzpRdEwVq.J6JnuD39jGkFMp3boN.cjwVqYhhY11C','general','kentoyamamoto',17),(13,'yuki.shimizu@rdcompany.com','$2a$10$rfSGPtz9.QuvfjorRv23suTjOSDdASIItA6a5MU7R3hXveoPTHX4q','general','general',24),(14,'admin@gmail.com','$2a$10$VBClk6iWLD40HoGzHZzhJeqka6XZqnVHWl/fhempYV63zUvrXrBVK','admin','admin',1);
/*!40000 ALTER TABLE `user_tbl` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-07 22:12:32
