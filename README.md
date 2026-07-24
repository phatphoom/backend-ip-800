# Web API Express (Product CRUD)

Express.js RESTful API project connected with MySQL for Product CRUD operations.

## 🚀 Setup & Installation

1. Clone repository:
   ```bash
   git clone <your-repo-url>
   cd web-api-express
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment configuration file:
   Copy `.env.example` to `.env` and fill in your database credentials:
   ```bash
   cp .env.example .env
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

5. Run production server:
   ```bash
   npm start
   ```

---

## 📌 API Endpoints

### Health & Welcome
- `GET /` - Welcome Message & System Server Time
- `GET /health` - Health check status

### Product CRUD (`/api/product`)
- `GET /api/product/all/` - Get all products
- `GET /api/product/:id` - Get product by ID
- `POST /api/product/add` - Create new product
- `PUT /api/product/edit/:id` - Update product by ID
- `DELETE /api/product/delete/:id` - Delete product by ID

---

## 🔒 Standard API Response Format

**Success:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error details message"
}
```
