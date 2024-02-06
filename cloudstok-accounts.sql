DROP database IF exists cloudstok_accounts;
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
   `customer_id` int NOT NULL AUTO_INCREMENT,
   `user_id` int,
   `customer_name` varchar(60) NOT NULL,
   `customer_address` varchar(255) NOT NULL,
   `customer_email` varchar(60) not null, 
   `customer_phone` varchar(60) default null,
   `pincode` int,
   `city` varchar(255),
   `customer_gstin` varchar(60) not null,
   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   `is_deleted` tinyint(1) DEFAULT '0',
   PRIMARY KEY (`customer_id`),
	foreign key(`user_id`) references user(`user_id`)   

 );
 
 CREATE TABLE if not exists `support` (
   `support_id` int NOT NULL AUTO_INCREMENT,
   `user_id` int,
   `support_name` varchar(60) NOT NULL,
   `support_email` varchar(60) not null, 
   `support_mobile_number` varchar(60) not null,
   `support_role` enum ("admin", "support") default "support",
   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   `is_deleted` tinyint(1) DEFAULT '0',
   PRIMARY KEY (`support_id`),
      foreign key(`user_id`) references user(`user_id`)   

 );
 
  CREATE TABLE if not exists `billing` (
  `billing_id` int not null auto_increment, 
   `created_by` int ,
   `customer_id` int ,
   `billing_invoice-no` int not null,
   `billing_date` datetime default current_timestamp,
   `billing_delivery_note` int default null,
   `billing_terms_of_payment` int default null,
   `billing_reference_number` varchar(60) not null,
   `billing_other_reference` varchar(60) default null,
   `billing_buyer_order_number` varchar(60) default null,
   `billing_dispatch_doc_no` varchar(60) default null,
   `billing_delivery_note_date` varchar(60) default null,
   `billing_dispatched_throught` varchar(60) default null,
   `billing_destination` varchar(255) default null,
   `billing_terms_of_delivery` varchar(255) default null,
    `order` json, 
    `total_amount` int not null,
    `amount_in_words` varchar(255) not  null,
   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   `is_deleted` tinyint(1) DEFAULT '0',
   PRIMARY KEY (`billing_id`),
   foreign key(`customer_id`) references customer(`customer_id`),
   foreign key(`created_by`) references user(`user_id`)   
 );
 
 
 create table if not exists `billing_info` (
 `meta_data_id` int not null auto_increment ,
 `billing_info_meta_data` json ,
 `created_by` int,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   `is_deleted` tinyint(1) DEFAULT '0',
   primary key(`meta_data_id`),
   foreign key (`created_by`) references user(`user_id`)
 );

 INSERT IGNORE INTO user(user_email, user_password, user_type) values('prashant.gupta@cloudstok.com', '$2b$12$cEmEi0MU1/IkIDB2oQeWm.D96V.liJiyq0PopuO6b4uyygg1R2LNm', 'admin'); --pass: prashant@12345