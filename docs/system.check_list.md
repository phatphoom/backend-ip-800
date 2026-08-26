# Product Management System — SRS Checklist

## 📱 Frontend — React Native / Expo

### Authentication
- [ ] Login
- [ ] JWT Token
- [ ] ส่ง `Authorization: Bearer <token>` ไปกับ API
- [ ] Token หมดอายุ / 401 → กลับหน้า Login

### Product List
- [ ] แสดงรายการสินค้า
- [ ] แสดงรูปสินค้า
- [ ] แสดงชื่อสินค้า
- [ ] แสดงราคา
- [ ] แสดง Stock
- [ ] แสดง Brand
- [ ] แสดง Product Code
- [ ] แสดง Status
- [ ] Pagination

### Search
- [ ] SearchBar
- [ ] ค้นหาสินค้าด้วย Keyword
- [ ] ส่ง Search ไป Backend เช่น `?search=adidas`
- [ ] Debounce ประมาณ 300ms
- [ ] Clear Search
- [ ] แสดงจำนวนผลลัพธ์

### Product Detail
- [ ] ดูรายละเอียดสินค้า
- [ ] แสดง Size
- [ ] แสดง Status
- [ ] แสดง Location / Store
- [ ] แสดงข้อมูลสินค้าอื่น ๆ ที่จำเป็น

### Product Management — Admin
- [ ] เพิ่มสินค้า
- [ ] แก้ไขสินค้า
- [ ] ลบสินค้า
- [ ] แสดงปุ่ม Edit/Delete เฉพาะ Admin
- [ ] Confirmation ก่อน Delete
- [ ] Disable ปุ่มระหว่าง Delete
- [ ] อัปเดตรายการทันทีหลัง Delete สำเร็จ

### UI States
- [ ] Loading State
- [ ] Empty State / ไม่พบสินค้า
- [ ] Error State
- [ ] Delete Loading State

---

## ⚙️ Backend — Express.js

### Product API
- [x] `GET /api/products`
- [x] `GET /api/products/:id`
- [x] `POST /api/products`
- [x] `PUT /api/products/:id`
- [x] `DELETE /api/products/:id`

### Search & Pagination
- [x] รองรับ `?search=...`
- [x] Search หลาย Column
- [x] รองรับ `page`
- [x] รองรับ `limit`
- [x] Response มี `items`
- [x] Response มี `total`
- [x] Response มี `page`
- [x] Response มี `limit`

### Authentication & Authorization
- [x] JWT Middleware
- [x] ตรวจสอบ Token
- [x] `401 Unauthorized` เมื่อ Token ไม่ถูกต้อง
- [x] `requireAdmin` Middleware
- [x] `403 Forbidden` เมื่อไม่มีสิทธิ์
- [x] Admin เท่านั้นที่เพิ่ม/แก้ไข/ลบสินค้าได้

### Security
- [x] ใช้ Prepared Statements / Parameterized Query
- [x] ป้องกัน SQL Injection
- [x] Validate Product ID
- [x] ตรวจสอบว่าสินค้ามีอยู่ก่อน Delete
- [x] Return `404 Not Found` เมื่อไม่พบสินค้า

---

## 🗄️ Database — MySQL

### Product Table
- [x] `id`
- [x] `productCode`
- [x] `name`
- [x] `description`
- [x] `price`
- [x] `stock`
- [x] `category`
- [x] `brand`
- [x] `color`
- [x] `size`
- [x] `status`
- [x] `location`
- [x] `image`
- [x] `lastUpdate`

### Database Performance
- [x] Index `productCode`
- [x] Index `name`
- [x] Index `brand`
- [x] Index `category`
- [x] พิจารณา FULLTEXT Search หากจำเป็น

---

## 🔐 Role

| Feature | User | Admin |
|---|:---:|:---:|
| Login | ✅ | ✅ |
| ดูสินค้า | ✅ | ✅ |
| Search | ✅ | ✅ |
| ดูรายละเอียด | ✅ | ✅ |
| เพิ่มสินค้า | ❌ | ✅ |
| แก้ไขสินค้า | ❌ | ✅ |
| ลบสินค้า | ❌ | ✅ |

---

## 🎯 Core Requirement

- [x] **Authentication** — Login + JWT
- [x] **Product Listing** — ดูรายการสินค้า
- [x] **Search** — ค้นหาสินค้า
- [x] **Pagination** — แบ่งหน้า
- [x] **Product Detail** — ดูรายละเอียด
- [x] **CRUD** — เพิ่ม / ดู / แก้ไข / ลบ
- [x] **Role-Based Access** — User / Admin
- [x] **Security** — JWT + SQL Injection Prevention
- [x] **MySQL Database**