CREATE DATABASE Magazin;


DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories(
	category_id int generated always as identity primary key,
	category_name character varying(30) not null
);


INSERT INTO categories(category_name) VALUES
('Telephones'),
('Laptops'),
('Books'),
('Kitchen utensils');

DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products(
	product_id int generated always as identity primary key,
	product_name character varying(30) not null,
	product_price decimal(6,2) not null,
	product_img character varying(50) not null,
	short_description character varying(200),
	description character varying(2000),
	category_id int not null references categories(category_id)
);



INSERT INTO products(product_name, product_price,product_img,short_description,description,category_id) VALUES
('Sony',2100.32,'/images/sony.jpg','good Tv','The Sony TV 2022 lineup is potentially shaping up to be the manufacturer best',1),
('Artel',1645.21,'/images/artel.png','good Tv','The Artel TV 2022 lineup is potentially shaping up to be the manufacturer best',1),
('LG',654.50,'/images/lg.png','good Tv','The LG TV 2022 lineup is potentially shaping up to be the manufacturer best',1),
('Panasonic',1153.56,'/images/panasonic.jpg','good Tv','The Panasonic TV 2022 lineup is potentially shaping up to be the manufacturer best',1),
('Asus',1553.11,'/images/asus.jpg','best laptop','ASUSTeK Computer Inc., usually referred to as ASUS, is a computer hardware and electronics company',2),
('Acer',722.00,'/images/acer.jpg','best laptop','AcerTeK Computer Inc., usually referred to as Acer, is a computer hardware and electronics company',2),
('Lenovo',1601.01,'/images/lenovo.jpg','best laptop','LenovoTeK Computer Inc., usually referred to as Lenovo, is a computer hardware and electronics company',2),
('Apple',2570.09,'/images/apple.jpg','best laptop','AppleTeK Computer Inc., usually referred to as Apple, is a computer hardware and electronics company',2),
('Netflix',23.90,'/images/netflix.png','best book','A book is a medium for recording information in the form of writing or images, typically composed of many pages',3),
('Mumu',2.90,'/images/mumu.jpeg','best book','A book is a medium for recording information in the form of writing or images, typically composed of many pages',3),
('ZARA',15.90,'/images/zara.png','best book','A book is a medium for recording information in the form of writing or images, typically composed of many pages',3),
('StenLi',14.90,'/images/stenli.png','best book','A book is a medium for recording information in the form of writing or images, typically composed of many pages',3),
('Refrigerator',794.06,'/images/refrig.jpg','best utensils','A kitchen utensil is a small hand held tool used for food preparation.',4),
('Dishwasher',470.04,'/images/dishwash.jpg','best utensils','A kitchen utensil is a small hand held tool used for food preparation.',4),
('Blender',300.09,'/images/blender.jpg','best utensils','A kitchen utensil is a small hand held tool used for food preparation.',4),
('Pots and Kazan',41.09,'/images/kazan.jpg','best utensils','A kitchen utensil is a small hand held tool used for food preparation.',4);



DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
	user_id int generated always as identity primary key,
	user_name character varying(50) not null unique,
	password character varying(256) not null,
	contact character varying(12) not null,
	email text,
	role boolean default false
);


INSERT INTO users(user_name, password,contact,email,role) VALUES 
('Admin',crypt('admin',gen_salt('bf')),'998912223344',null,true),
('Ali',crypt('1111',gen_salt('bf')),'998903319575','ali@gmail.com',false),
('Hikmat',crypt('2222',gen_salt('bf')),'998901234567','hikmat@gmail.com',false),
('Oysha',crypt('1234',gen_salt('bf')),'998997654321','oysha@gmail.com',false),
('Nosir',crypt('0000',gen_salt('bf')),'998942264275','nosir@gmail.com',false);


DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders(
	order_id int generated always as identity primary key,
	user_id int not null references users(user_id),
	totalPrice decimal(7,2) default 0,
	isPaid boolean default false,
	createTime timestamptz default current_timestamp

);


INSERT INTO orders(user_id,totalPrice,isPaid) VALUES 
(2,2754.82,true),
(4,0,false),
(3,2246.22,true);

DROP TABLE IF EXISTS order_products CASCADE;
CREATE TABLE order_products(
	orderPrId int generated always as identity,
	order_id int not null references orders(order_id),
	product_id int not null references products(product_id)
);


INSERT INTO order_products(order_id,product_id) VALUES
(1,1),(1,3),(3,4),(2,7),(3,10),(3,8),(2,2);


