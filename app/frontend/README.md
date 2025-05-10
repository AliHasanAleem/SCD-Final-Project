 A full-stack MERN (MongoDB, Express.js, React, Node.js) ecommerce application for seamless shopping and selling. Customers can search products, add to cart, and checkout, while sellers can manage products and monitor sales.

 ## Project Description
 This project is part of the SCD course, demonstrating a MERN ecommerce application deployed on a local Kubernetes cluster using Minikube. ShopCart allows users to register as customers or sellers, browse products by category, leave reviews, and track orders. Sellers have a dashboard to manage products and view sales data with visualizations.

 ## Features
 - **User Registration**: Register as a customer or seller.
 - **Cart System**: Add products to cart and review before checkout.
 - **Product Search**: Search by name or browse categories (Electronics, Clothes, Kitchen, etc.).
 - **Reviews and Ratings**: Customers can rate products out of 5.
 - **Seller Dashboard**: Manage products, view sales, and see data visualizations.
 - **Product Management**: Sellers add products, set prices, and track cart additions.
 - **Order Tracking**: Sellers monitor customer orders.

 ## Prerequisites
 - Node.js 18
 - MongoDB
 - Docker (for later parts)
 - Minikube and kubectl (for Kubernetes deployment)

 ## Project Structure
 ```
 ├── app/
 │   ├── frontend/         # React frontend
 │   ├── backend/          # Node.js/Express backend
 ├── docker-compose.yml    # Docker Compose configuration
 ├── .gitignore            # Git ignore file
 ├── README.md             # Project documentation
 ```

 ## Running the Application Locally
 1. **Clone the Repository**:
    ```bash
    git clone https://github.com/<your-username>/MERN-Ecommerce-Site.git
    cd MERN-Ecommerce-Site
    ```
 2. **Install MongoDB**:
    ```bash
    brew tap mongodb/brew
    brew install mongodb-community
    brew services start mongodb-community
    ```
 3. **Run Backend**:
    ```bash
    cd app/backend
    npm install
    cp .env.example .env
    npm start
    ```
    - Backend runs on `http://localhost:5000`.
    - Edit `.env` with your MongoDB URL (e.g., `MONGO_URL=mongodb://127.0.0.1/ecommerce`).
 4. **Run Frontend**:
    ```bash
    cd app/frontend
    npm install
    npm start
    ```
    - Frontend runs on `http://localhost:3000`.
 5. **Test the App**:
    - Open `http://localhost:3000`.
    - Register as a customer or seller, browse products, add to cart, and test checkout.

 ## Troubleshooting
 If you encounter a network error during signup:
 1. Open `app/frontend/src/redux/userHandle.js`.
 2. Add:
    ```javascript
    const REACT_APP_BASE_URL = "http://localhost:5000";
    ```
 3. Replace `process.env.REACT_APP_BASE_URL` with `REACT_APP_BASE_URL`.

 ## Next Steps
 - Containerize the app (Dockerfiles in `app/frontend` and `app/backend`).
 - Deploy to Minikube using Kubernetes manifests.
 - Set up CI/CD with GitHub Actions.

 ## Environment
 - OS: macOS 15.3 (ARM64)
 - Node.js: 18
 - MongoDB: Latest
 - Docker: Latest
 - Minikube: v1.35.0
 - kubectl: Latest