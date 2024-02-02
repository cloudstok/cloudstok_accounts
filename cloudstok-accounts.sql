create database if not exists cloudstok_accounts;
use cloudstok_accounts;

 create table if not exists `user` (
 `user_id` int not null auto_increment,
 `user_email` varchar(255) not null,
 `user_password` varchar(255) not null,
 `user_type` enum("admin", "support", "customer"),
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   `is_deleted` tinyint(1) DEFAULT '0',
   primary key (`user_id`)
 );

CREATE TABLE if not exists `customer` (
`user_id` int,
   `customer_id` int NOT NULL AUTO_INCREMENT,
   `customer_name` varchar(60) NOT NULL,
   `customer_address` varchar(255) NOT NULL,
   `customer_email` varchar(60) not null, 
   `customer-phone` varchar(25) default null,
   `customer_gstin` varchar(60) not null,
   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   `is_deleted` tinyint(1) DEFAULT '0',
   PRIMARY KEY (`customer_id`),
   UNIQUE KEY `customer_email` (`customer_email`),
	foreign key(`user_id`) references user(`user_id`)   

 );
 
 CREATE TABLE if not exists `support` (
 `user_id` int,
   `support_id` int NOT NULL AUTO_INCREMENT,
   `support_name` varchar(60) NOT NULL,
   `support_email` varchar(60) not null, 
   `support_mobile_number` varchar(15) not null,
   `support_role` enum ("admin", "support") default "support",
   `support_password` varchar(60) not null,
   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   `is_deleted` tinyint(1) DEFAULT '0',
   PRIMARY KEY (`support_id`),
   UNIQUE KEY `support_email` (`support_email`),
      foreign key(`user_id`) references user(`user_id`)   

 );
 
  CREATE TABLE if not exists `billing` (
  `billing_id` int not null auto_increment, 
   `support_id` int ,
   `customer_id` int ,
   `billing_invoice-no` int not null,
   `billing_date` datetime default current_timestamp,
   `billing_delivery_note` int default null,
   `billing_terms_of_payment` int default null,
   `billing_reference_number` varchar(50) not null,
   `billing_other_reference` varchar(50) default null,
   `billing_buyer_order_number` varchar(50) default null,
   `billing_dispatch_doc_no` varchar(50) default null,
   `billing_delivery_note_date` varchar(50) default null,
   `billing_dispatched_throught` varchar(50) default null,
   `billing_destination` varchar(255) default null,
   `billing_terms_of_delivery` varchar(255) default null,
   `billing_receiver_address` text default null,
   `billing_sl_no` varchar(10) default null,
   `billing_description_of_goods` varchar(255) default null,
   `billing_hsn_sac` varchar(255) default null,
   `billing_quantity` varchar(255) default null,
   `billing_rate` varchar(255) default null,
   `billing_per` varchar(255) default null,
   `billing_amount` varchar(255) not null,
   `billing_base_amount`varchar(255) not null,
   `billing_tax_amount` varchar(255) not null,
   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   `is_deleted` tinyint(1) DEFAULT '0',
   PRIMARY KEY (`billing_id`),
   foreign key(`customer_id`) references customer(`customer_id`),
   foreign key(`support_id`) references support(`support_id`)   
 );
 
 
 create table if not exists `billing_info` (
 `meta_data_id` int not null auto_increment ,
 `billing_info_meta_data` json ,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   `is_deleted` tinyint(1) DEFAULT '0',
   primary key(`meta_data_id`)
 );