📌 Overview
ShopEase is a full-stack e-commerce web application that enables users to browse products, manage their shopping cart, and place orders — with all data persisted in a MySQL database via Spring Data JPA. The backend is powered by Spring Boot REST APIs and the frontend is built with HTML, CSS, and JavaScript.

🗓️ Developed: January 2026  |  👩‍💻 Developer: Sakshi


✨ Features
User Features

Browse all available products on the home page
Add any product to the cart with one click
Remove individual items or clear the entire cart
Place orders by filling in name, email, and delivery address
View all previously placed orders with status and date

Admin Features

Add new products with name, description, price, quantity, and image URL
Manage product inventory from the Admin panel

Technical Features

RESTful API architecture with Spring Boot
MySQL database integration via Spring Data JPA
Fully responsive UI for all screen sizes
Auto table creation via Hibernate DDL


🛠️ Tech Stack
LayerTechnologyVersionLanguageJava21 LTSBackend FrameworkSpring Boot3.2.5ORMSpring Data JPA + Hibernate6.4.xDatabaseMySQL Community Server8.0.45FrontendHTML5, CSS3, JavaScript—Build ToolApache Maven3.9.13Embedded ServerApache Tomcat10.1.xIDEVS Code1.111.0

*Project Structure
ShopEase/
├── pom.xml
└── src/
    └── main/
        ├── java/
        │   └── com/shopease/
        │       ├── ShopEaseApplication.java
        │       ├── controller/
        │       │   ├── ProductController.java
        │       │   ├── CartController.java
        │       │   └── OrderController.java
        │       ├── model/
        │       │   ├── Product.java
        │       │   ├── CartItem.java
        │       │   └── Order.java
        │       ├── repository/
        │       │   ├── ProductRepository.java
        │       │   ├── CartItemRepository.java
        │       │   └── OrderRepository.java
        │       └── service/
        │           ├── ProductService.java
        │           ├── CartService.java
        │           └── OrderService.java
        └── resources/
            ├── application.properties
            └── static/
                ├── index.html
                ├── style.css
                └── app.js

🚀 Getting Started
Prerequisites
ToolVersionDownloadJava JDK21 LTSAdoptiumApache Maven3.9+maven.apache.orgMySQL Server8.0mysql.comVS CodeLatestcode.visualstudio.comGitLatestgit-scm.com
Installation Steps
1. Clone the repository
bashgit clone https://github.com/Sakshi-kamdi/ShopEase.git
cd ShopEase
2. Create the MySQL database
sqlCREATE DATABASE shopease;
3. Configure database credentials
Open src/main/resources/application.properties:
propertiesspring.datasource.url=jdbc:mysql://localhost:3306/shopease
spring.datasource.username=root
spring.datasource.password=MYSakshi@031
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080
4. Run the application
bashmvn spring-boot:run
```

**5. Open in browser**
```
http://localhost:8080

Go to the Admin tab first to add products!


📡 API Documentation
Base URL: http://localhost:8080
Products /api/products
MethodEndpointDescriptionGET/api/productsGet all productsGET/api/products/{id}Get product by IDPOST/api/productsAdd new productDELETE/api/products/{id}Delete product
POST /api/products
json{
  "name": "Laptop",
  "description": "Gaming laptop",
  "price": 75000,
  "quantity": 10,
  "imageUrl": ""
}
Cart /api/cart
MethodEndpointDescriptionGET/api/cartGet all cart itemsPOST/api/cart/addAdd item to cartDELETE/api/cart/remove/{id}Remove itemDELETE/api/cart/clearClear entire cart
POST /api/cart/add
json{
  "productId": 1,
  "productName": "Laptop",
  "price": 75000,
  "quantity": 1
}
Orders /api/orders
MethodEndpointDescriptionGET/api/ordersGet all ordersPOST/api/ordersPlace new order
POST /api/orders
json{
  "customerName": "Sakshi",
  "customerEmail": "sakshi@gmail.com",
  "address": "Mumbai, Maharashtra",
  "totalAmount": 75000
}

🗄️ Database Schema
sqlCREATE TABLE products (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  description VARCHAR(255),
  price DOUBLE,
  quantity INT,
  image_url VARCHAR(255)
);

CREATE TABLE cart_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT,
  product_name VARCHAR(255),
  price DOUBLE,
  quantity INT
);

CREATE TABLE orders (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  address VARCHAR(255),
  total_amount DOUBLE,
  status VARCHAR(255),
  order_date DATETIME
);

✅ Tables are auto-created by Hibernate on first run — no manual SQL needed.


🔮 Future Enhancements

 User authentication with Spring Security + JWT
 Payment gateway integration (Razorpay / Stripe)
 Product search and filter by category/price
 Email notifications for order confirmation
 Admin dashboard with sales analytics
 Deploy on AWS / Railway / Render
 Mobile app using React Native


⚠️ Known Limitations

No user authentication — APIs are publicly accessible
No real payment processing
Cart is shared — no session management per user
No product image upload — only image URL supported

