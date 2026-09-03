# 📘 REST API Specification & Integration Guide

เอกสารข้อกำหนด API (API Specification) สำหรับทีม Frontend (React Native Expo / Web Applications)  
อัปเดตล่าสุดตามซอร์สโค้ดของระบบ Backend Express.js (พอร์ตเริ่มต้น: `3036` หรือตาม `.env`)

---

## 📑 สารบัญ
1. [การเชื่อมต่อ & Base URL (React Native / Expo Guide)](#1-การเชื่อมต่อ--base-url-react-native--expo-guide)
2. [รูปแบบโครงสร้าง Response มาตรฐาน](#2-รูปแบบโครงสร้าง-response-มาตรฐาน)
3. [ระบบสมัครสมาชิก & เข้าสู่ระบบ (Authentication)](#3-ระบบสมัครสมาชิก--เข้าสู่ระบบ-authentication)
4. [ระบบอัปโหลดรูปภาพ (File Upload - Base64)](#4-ระบบอัปโหลดรูปภาพ-file-upload---base64)
5. [ระบบหมวดหมู่สินค้า (Categories)](#5-ระบบหมวดหมู่สินค้า-categories)
6. [ระบบจัดการสินค้า (Products)](#6-ระบบจัดการสินค้า-products)
7. [ระบบตรวจสอบสถานะเซิร์ฟเวอร์ (Health Check)](#7-ระบบตรวจสอบสถานะเซิร์ฟเวอร์-health-check)
8. [คู่มือการทดสอบระบบ Role & Protected Routes ใน Postman](#8-คู่มือการทดสอบระบบ-role--protected-routes-ใน-postman)


---

## 1. การเชื่อมต่อ & Base URL (React Native / Expo Guide)

เนื่องจากการทดสอบบน React Native / Expo มีสภาวะแวดล้อมต่างกัน ให้ตั้งค่า **BASE_URL** ดังนี้:

- **Expo Environment Variable (`.env` ใน Expo):** `EXPO_PUBLIC_API_BASE_URL`
- **เครื่องจริง / Physical Device (Expo Go):** ใช้ IP ของเครื่องคอมพิวเตอร์ในวง LAN เดียวกัน (เช่น `http://192.168.1.50:3036`)
- **Android Emulator:** `http://10.0.2.2:3036`
- **iOS Simulator:** `http://localhost:3036`

---

## 2. รูปแบบโครงสร้าง Response มาตรฐาน

ทุก API ตอบกลับข้อมูลในรูปแบบ **JSON** เสมอ

### 🟢 2.1 Success Response (200 OK / 201 Created)
```json
{
  "success": true,
  "message": "ข้อความอธิบายการทำงานสำเร็จ (Optional)",
  "data": { ... } // หรือ Array [...]
}
```

### 🔴 2.2 Error Response (400 Bad Request / 401 Unauthorized / 404 Not Found / 500 Server Error)
```json
{
  "success": false,
  "message": "ข้อความอธิบายข้อผิดพลาด",
  "errors": {
    "field_name": "ข้อความระบุฟิลด์ที่ผิดพลาด (ถ้ามี)"
  }
}
```

---

## 3. ระบบสมัครสมาชิก & เข้าสู่ระบบ (Authentication)

Base Path: `/api/auth`

### 3.1 สมัครสมาชิก (Register)
- **Endpoint:** `POST /api/auth/register`
- **Authentication:** ไม่ต้องระบุ (Public)
- **Headers:** `Content-Type: application/json`

#### Request Body:
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `username` | String | ✅ ใช่ | ชื่อผู้ใช้งาน |
| `email` | String | ✅ ใช่ | อีเมล (ต้องไม่ซ้ำในระบบ) |
| `password` | String | ✅ ใช่ | รหัสผ่าน (ต้องมีความยาวอย่างน้อย 6 ตัวอักษร) |

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "secretpassword"
}
```

#### Response (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user_id": "user_0001",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

---

### 3.2 เข้าสู่ระบบ (Login)
- **Endpoint:** `POST /api/auth/login`
- **Authentication:** ไม่ต้องระบุ (Public)
- **Headers:** `Content-Type: application/json`

#### Request Body:
```json
{
  "email": "john@example.com",
  "password": "secretpassword"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIj...",
    "user": {
      "user_id": "user_0001",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

> 📌 **สำหรับทีม Frontend:**  
> นำ `token` ที่ได้ไปบันทึกลงใน `AsyncStorage` (React Native) หรือ `localStorage` (Web) เพื่อใช้ส่งใน Header `Authorization: Bearer <TOKEN>` สำหรับ API ที่ต้องระบุตัวตน

---

### 3.3 ดึงข้อมูลผู้ใช้ปัจจุบัน (Get Current Profile)
- **Endpoint:** `GET /api/auth/me`
- **Authentication:** 🔐 ต้องระบุ Token
- **Headers:** 
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "user_id": "user_0001",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2026-08-11T10:00:00.000Z"
  }
}
```

---

### 3.4 ดึงและสร้าง/อัปเดตข้อมูลโปรไฟล์ (User Profile API)
- **Base Path:** `/api/profile`

#### 3.4.1 ดึงข้อมูลโปรไฟล์ของตนเอง (Get My Profile)
- **Endpoint:** `GET /api/profile/me`
- **Authentication:** 🔐 ต้องระบุ Token
- **Headers:** `Authorization: Bearer <YOUR_JWT_TOKEN>`

##### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "user_id": "user_0001",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "first_name": "Somchai",
    "last_name": "Jaidee",
    "phone_number": "0812345678",
    "avatar_url": "/uploads/products/1770800000000-123456789.png",
    "address": "123 Sukhumvit Road, Bangkok",
    "created_at": "2026-08-13T14:00:00.000Z",
    "updated_at": "2026-08-13T14:00:00.000Z"
  }
}
```

#### 3.4.2 สร้างหรืออัปเดตโปรไฟล์ของตนเอง (Create / Update Profile)
- **Endpoint:** `PUT /api/profile/me` หรือ `POST /api/profile/me`
- **Authentication:** 🔐 ต้องระบุ Token
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

##### Request Body:
```json
{
  "first_name": "Somchai",
  "last_name": "Jaidee",
  "phone_number": "0812345678",
  "avatar_url": "/uploads/products/1770800000000-123456789.png",
  "address": "123 Sukhumvit Road, Bangkok"
}
```

##### Response (200 OK):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user_id": "user_0001",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "first_name": "Somchai",
    "last_name": "Jaidee",
    "phone_number": "0812345678",
    "avatar_url": "/uploads/products/1770800000000-123456789.png",
    "address": "123 Sukhumvit Road, Bangkok",
    "created_at": "2026-08-13T14:00:00.000Z",
    "updated_at": "2026-08-13T14:30:00.000Z"
  }
}
```

#### 3.4.3 ดึงข้อมูลโปรไฟล์ตาม user_id
- **Endpoint:** `GET /api/profile/:user_id`
- **Authentication:** 🔐 ต้องระบุ Token
- **Headers:** `Authorization: Bearer <YOUR_JWT_TOKEN>`

---

### 3.5 เปลี่ยนรหัสผ่าน (Change Password)
- **Endpoint:** `PUT /api/auth/change-password`
- **Authentication:** 🔐 ต้องเข้าสู่ระบบ (User หรือ Admin)
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

#### Request Body:
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `current_password` | String | ✅ ใช่ | รหัสผ่านปัจจุบัน |
| `new_password` | String | ✅ ใช่ | รหัสผ่านใหม่ (ต้องมีความยาวอย่างน้อย 6 ตัวอักษร และไม่ซ้ำรหัสเดิม) |
| `confirm_password` | String | ❌ ไม่จำเป็น | ยืนยันรหัสผ่านใหม่ (หากส่งมาต้องตรงกับ `new_password`) |

```json
{
  "current_password": "oldsecret123",
  "new_password": "newsecret456",
  "confirm_password": "newsecret456"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### Error Response (400 Bad Request):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "current_password": "Incorrect current password"
  }
}
```

---

### 3.6 รีเซ็ตรหัสผ่าน (Reset / Forgot Password)
- **Endpoint:** `POST /api/auth/reset-password`
- **Authentication:** 🌐 ไม่ต้องระบุ (Public สำหรับกรณีลืมรหัสผ่าน)
- **Headers:** 
  - `Content-Type: application/json`

#### Request Body:
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | String | ✅ ใช่ | อีเมลที่ต้องการรีเซ็ตรหัสผ่าน |
| `new_password` | String | ✅ ใช่ | รหัสผ่านใหม่ (ต้องมีความยาวอย่างน้อย 6 ตัวอักษร) |
| `confirm_password` | String | ❌ ไม่จำเป็น | ยืนยันรหัสผ่านใหม่ (หากส่งมาต้องตรงกับ `new_password`) |

```json
{
  "email": "john@example.com",
  "new_password": "brandnewsecret123",
  "confirm_password": "brandnewsecret123"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

#### Error Response (404 Not Found):
```json
{
  "success": false,
  "message": "No user found with this email",
  "errors": {
    "email": "User not found"
  }
}
```

---

### 3.7 ลบบัญชีผู้ใช้ (Delete Account)
- **Endpoint:** `DELETE /api/auth/account` หรือ `DELETE /api/auth/me`
- **Authentication:** 🔐 ต้องเข้าสู่ระบบ (User หรือ Admin)
- **Headers:** 
  - `Content-Type: application/json` (หากส่ง Body)
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`

#### Request Body (Optional):
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `password` | String | ❌ ไม่จำเป็น | รหัสผ่านเพื่อยืนยันการลบบัญชี (หากส่งมาจะถูกตรวจสอบก่อนลบ) |

```json
{
  "password": "mysecretpassword"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## 4. ระบบอัปโหลดรูปภาพ (File Upload - Base64)


Base Path: `/api/upload`  
*(หมายเหตุ: ระบบเปลี่ยนเป็นแนวทาง Base64 JSON เพื่อให้ใช้งานร่วมกับ React Native Expo / Serverless ได้โดยไม่ใช้ Multer)*

### 4.1 อัปโหลดรูปภาพ (Upload Image)
- **Endpoint:** `POST /api/upload`
- **Authentication:** 🔒 ต้องเข้าสู่ระบบ (User หรือ Admin)  
- **Headers:**  
  - `Content-Type: application/json`  
  - `Authorization: Bearer <your_jwt_token>`


#### Request Body:
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `image` | String | ✅ ใช่ | ข้อมูลรูปภาพในรูปแบบ Base64 (เช่น `data:image/png;base64,...` หรือ Base64 String เพียวๆ) |
| `filename` | String | ❌ ไม่จำเป็น | ชื่อไฟล์ต้นฉบับ (เช่น `photo.png`) |

#### ข้อจำกัด (Constraints):
- **ชนิดไฟล์ที่อนุญาต:** `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- **ขนาดไฟล์สูงสุด:** ไม่เกิน **5 MB**

```json
{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "filename": "my_product.png"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "message": "อัปโหลดรูปภาพสำเร็จ (Base64)",
  "data": {
    "filename": "1770800000000-123456789.png",
    "size_bytes": 70,
    "image_url": "/uploads/products/1770800000000-123456789.png"
  }
}
```

> 💡 **คำแนะนำการนำไปแสดงผล:**  
> นำ `image_url` ที่ได้จาก response ไปบันทึกใส่ฟิลด์ `image_url` ในการสร้างสินค้า (`POST /api/product/add`)  
> และเวลาแสดงผลใน React Native ให้ประกอบ URL เต็ม: `<Image source={{ uri: `${BASE_URL}${item.image_url}` }} />`

---

## 5. ระบบหมวดหมู่สินค้า (Categories)

Base Path: `/api/category` หรือ `/api/categories`

### 5.1 ดึงรายการหมวดหมู่ทั้งหมด (Get All Categories)
- **Endpoint:** `GET /api/category`
- **Authentication:** ไม่ต้องระบุ (Public)

#### Response (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "cate_id": "cate_0001",
      "cate_name": "Electronics",
      "image_url": "/uploads/products/1770800000000-category1.png",
      "product_count": 12
    },
    {
      "cate_id": "cate_0002",
      "cate_name": "Accessories",
      "image_url": null,
      "product_count": 5
    }
  ]
}
```

---

### 5.2 ดึงหมวดหมู่สินค้าตาม ID (Get Category by ID)
- **Endpoint:** `GET /api/category/:id`
- **Authentication:** ไม่ต้องระบุ (Public)

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "cate_id": "cate_0001",
    "cate_name": "Electronics",
    "image_url": "/uploads/products/1770800000000-category1.png"
  }
}
```

---

### 5.3 เพิ่มหมวดหมู่สินค้าใหม่ (Create Category)
- **Endpoint:** `POST /api/category`
- **Authentication:** 🔒 ต้องเป็น Admin เท่านั้น (`role: 'admin'`)
- **Headers:**  
  - `Content-Type: application/json`  
  - `Authorization: Bearer <admin_jwt_token>`

#### Request Body:
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `cate_name` | String | ✅ ใช่ | - | ชื่อหมวดหมู่สินค้า |
| `image_url` | String | ❌ ไม่จำเป็น | `null` | Path รูปภาพ (อัปโหลดจาก `POST /api/upload`) |

```json
{
  "cate_name": "Gadgets",
  "image_url": "/uploads/products/1770800000000-gadgets.png"
}
```

#### Response (201 Created):
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "cate_id": "cate_0003",
    "cate_name": "Gadgets",
    "image_url": "/uploads/products/1770800000000-gadgets.png"
  }
}
```

---

### 5.4 แก้ไขข้อมูลหมวดหมู่สินค้า (Update Category)
- **Endpoint:** `PUT /api/category/:id`
- **Authentication:** 🔒 ต้องเป็น Admin เท่านั้น (`role: 'admin'`)
- **URL Parameter:** `:id` = รหัสหมวดหมู่ (เช่น `cate_0001`)

#### Request Body:
```json
{
  "cate_name": "Electronics & Tech",
  "image_url": "/uploads/products/1770800000000-new_electronics.png"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": "cate_0001",
    "cate_name": "Electronics & Tech",
    "image_url": "/uploads/products/1770800000000-new_electronics.png"
  }
}
```

---

### 5.5 ลบหมวดหมู่สินค้า (Delete Category - Soft Delete)
- **Endpoint:** `DELETE /api/category/:id`
- **Authentication:** 🔒 ต้องเป็น Admin เท่านั้น (`role: 'admin'`)
- **URL Parameter:** `:id` = รหัสหมวดหมู่ (เช่น `cate_0001`)
- **หมายเหตุ:** เป็นการทำ Soft Delete (บันทึกเวลา `deleted_at`) หมวดหมู่จะถูกซ่อนจาก API ดึงรายการทั่วไป

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## 6. ระบบจัดการสินค้า (Products)

Base Path: `/api/products`

### 6.1 ดึงรายการสินค้า / ค้นหาสินค้า & แบ่งหน้า (Get All / Search Products & Pagination)
- **Endpoint:** `GET /api/products`
- **Authentication:** ไม่ต้องระบุ (Public)
- **Query Parameters:**
  | Parameter | Type | Required | Default | Description |
  | :--- | :--- | :--- | :--- | :--- |
  | `search` หรือ `q` | String | ❌ | `""` | คำค้นหา (ค้นหาครอบคลุมหลายคอลัมน์: รหัสสินค้า, ชื่อ, รายละเอียด, หมวดหมู่) |
  | `page` | Number | ❌ | `1` | หน้าที่ต้องการดึง (เริ่มต้นที่ 1) |
  | `limit` | Number | ❌ | `10` | จำนวนรายการต่อหน้า |
  | `category` หรือ `cate_id` | String | ❌ | `""` | กรองตามรหัสหมวดหมู่หรือชื่อหมวดหมู่ |

#### ตัวอย่าง Request:
- ดึงสินค้าหน้าแรก: `GET /api/products?page=1&limit=10`
- ค้นหาสินค้า: `GET /api/products?search=adidas` หรือ `GET /api/products?q=keyboard`
- ค้นหาพร้อมแบ่งหน้า: `GET /api/products?search=gaming&page=1&limit=10`

#### Response (200 OK):
```json
{
  "success": true,
  "items": [
    {
      "prod_id": "prod_0001",
      "prod_name": "Mechanical Keyboard",
      "description": "RGB Backlit Gaming Keyboard",
      "price": "1990.00",
      "currency": "THB",
      "cate_id": "cate_0001",
      "category_name": "Electronics",
      "image_url": "/uploads/products/1770800000000-123456789.png",
      "in_stock": 1,
      "stock_count": 25,
      "discount_pct": 10
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1,
  "data": [
    {
      "prod_id": "prod_0001",
      "prod_name": "Mechanical Keyboard",
      "description": "RGB Backlit Gaming Keyboard",
      "price": "1990.00",
      "currency": "THB",
      "cate_id": "cate_0001",
      "category_name": "Electronics",
      "image_url": "/uploads/products/1770800000000-123456789.png",
      "in_stock": 1,
      "stock_count": 25,
      "discount_pct": 10
    }
  ]
}
```

---

### 6.2 ดึงรายละเอียดสินค้าตาม ID (Get Product by ID)
- **Endpoint:** `GET /api/products/:id`
- **Authentication:** ไม่ต้องระบุ (Public)
- **URL Parameter:** `:id` = รหัสสินค้า (เช่น `prod_0001`)

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "prod_id": "prod_0001",
    "prod_name": "Mechanical Keyboard",
    "description": "RGB Backlit Gaming Keyboard",
    "price": "1990.00",
    "currency": "THB",
    "cate_id": "cate_0001",
    "image_url": "/uploads/products/1770800000000-123456789.png",
    "in_stock": true,
    "stock_count": 25,
    "discount_pct": 10,
    "created_at": "2026-08-11T10:00:00.000Z"
  }
}
```

#### Error Response (404 Not Found):
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### 6.3 เพิ่มสินค้าใหม่ (Create Product)
- **Endpoint:** `POST /api/products`
- **Authentication:** 🔒 ต้องเป็น Admin เท่านั้น (`role: 'admin'`)  
- **Headers:**  
  - `Content-Type: application/json`  
  - `Authorization: Bearer <admin_jwt_token>`

#### Request Body:
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `prod_name` | String | ✅ ใช่ | - | ชื่อสินค้า |
| `price` | Number | ✅ ใช่ | - | ราคาสินค้า (ต้องเป็นตัวเลข >= 0) |
| `cate_id` | String | ✅ ใช่ | - | รหัสหมวดหมู่สินค้า (เช่น `cate_0001`) |
| `description` | String | ❌ ไม่จำเป็น | `null` | รายละเอียดสินค้า |
| `currency` | String | ❌ ไม่จำเป็น | `"THB"` | สกุลเงิน |
| `image_url` | String | ❌ ไม่จำเป็น | `null` | Path รูปภาพที่ได้จาก API Upload |
| `in_stock` | Boolean | ❌ ไม่จำเป็น | `true` | สถานะการมีสินค้าในสต็อก |
| `stock_count` | Number | ❌ ไม่จำเป็น | `0` | จำนวนสินค้าคงเหลือ |
| `discount_pct` | Number | ❌ ไม่จำเป็น | `0` | เปอร์เซ็นต์ส่วนลด (%) |

```json
{
  "prod_name": "Gaming Mouse Wireless",
  "description": "Ergonomic 16000 DPI Mouse",
  "price": 1290,
  "currency": "THB",
  "cate_id": "cate_0001",
  "image_url": "/uploads/products/1770800000000-123456789.png",
  "in_stock": true,
  "stock_count": 50,
  "discount_pct": 5
}
```

#### Response (201 Created):
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "newProduct": {
      "prod_id": "prod_0002",
      "prod_name": "Gaming Mouse Wireless",
      "description": "Ergonomic 16000 DPI Mouse",
      "price": 1290,
      "currency": "THB",
      "cate_id": "cate_0001",
      "image_url": "/uploads/products/1770800000000-123456789.png",
      "in_stock": true,
      "stock_count": 50,
      "discount_pct": 5
    }
  }
}
```

---

### 6.4 แก้ไขข้อมูลสินค้า (Update Product)
- **Endpoint:** `PUT /api/products/:id`
- **Authentication:** 🔒 ต้องเป็น Admin เท่านั้น (`role: 'admin'`)  
- **Headers:**  
  - `Content-Type: application/json`  
  - `Authorization: Bearer <admin_jwt_token>`
- **URL Parameter:** `:id` = รหัสสินค้า (เช่น `prod_0001`)

#### Request Body:
ส่งเฉพาะฟิลด์ที่ต้องการแก้ไขเข้ามาใน JSON:
```json
{
  "price": 1190,
  "stock_count": 45,
  "discount_pct": 10
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": "prod_0001",
    "price": 1190,
    "stock_count": 45,
    "discount_pct": 10
  }
}
```

---

### 6.5 ลบสินค้า (Delete Product - Soft Delete)
- **Endpoint:** `DELETE /api/products/:id`
- **Authentication:** 🔒 ต้องเป็น Admin เท่านั้น (`role: 'admin'`)  
- **Headers:**  
  - `Authorization: Bearer <admin_jwt_token>`
- **URL Parameter:** `:id` = รหัสสินค้า (เช่น `prod_0001`)
- **หมายเหตุ:** เป็นการทำ Soft Delete (บันทึกเวลา `deleted_at`) สินค้าจะถูกซ่อนจาก API ดึงรายการทั่วไป

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```


---

## 7. ระบบตรวจสอบสถานะเซิร์ฟเวอร์ (Health Check)

### 7.1 Check Health Status
- **Endpoint:** `GET /health`
- **Response (200 OK):**
```json
{
  "status": "UP",
  "timestamp": "2026-08-11T10:00:00.000Z"
}
```

---

## 💻 ตัวอย่าง Helper Function สำหรับ React Native Expo (axios / fetch)

```javascript
import axios from 'axios';

// ตั้งค่า Base URL ตามเครื่องที่ใช้ทดสอบ
const API_BASE_URL = 'http://192.168.1.50:3036'; // เปลี่ยนเป็น IP คอมพิวเตอร์ของคุณ

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ฟังก์ชันอัปโหลดรูป Base64
export const uploadImageBase64 = async (base64Image, fileName) => {
  const response = await apiClient.post('/api/upload', {
    image: base64Image,
    filename: fileName,
  });
  return response.data;
};

// ฟังก์ชันดึงรูปภาพพร้อมพาทเต็ม
export const getFullImageUrl = (relativePath) => {
  if (!relativePath) return null;
  return `${API_BASE_URL}${relativePath}`;
};
```

---

## 8. คู่มือการทดสอบระบบ Role & Protected Routes ใน Postman

### 8.1 การเตรียมบัญชีทดสอบ (User vs Admin)

1. **สมัคร / เข้าสู่ระบบด้วย User ทั่วไป (`role: 'user'`):**
  - **Endpoint:** `POST /api/auth/login`
  - **Body (JSON):**
    ```json
    {
      "email": "user@example.com",
      "password": "userpassword"
    }
    ```
  - **คัดลอก `token`** ที่ได้จาก Response ไปใส่ใน **Postman Header**:
    - Key: `Authorization`
    - Value: `Bearer <YOUR_USER_TOKEN>`
    - หรือในแท็บ **Auth** ของ Postman -> เลือก Type: `Bearer Token` -> ใส่ Token ในช่อง Token

2. **เข้าสู่ระบบด้วย Admin (`role: 'admin'`):**
  - **Endpoint:** `POST /api/auth/login`
  - **Body (JSON):**
    ```json
    {
      "email": "admin@example.com",
      "password": "adminpassword"
    }
    ```
  - **คัดลอก `token`** ที่ได้จาก Response ไปใส่ใน **Postman Header**:
    - Key: `Authorization`
    - Value: `Bearer <YOUR_ADMIN_TOKEN>`

---

### 8.2 ตารางสรุปการทดสอบแต่ละกรณีใน Postman

| Case # | Endpoint | Method | Token ที่ใช้ | ผลลัพธ์ที่คาดหวัง (Expected Status & Response) |
| :---: | :--- | :---: | :--- | :--- |
| **1** | `/api/products` | `POST` | ❌ ไม่ใส่ Token | `401 Unauthorized`<br>`{ "success": false, "message": "Access token is required" }` |
| **2** | `/api/products` | `POST` | 👤 User Token | `403 Forbidden`<br>`{ "success": false, "message": "Access denied: Insufficient permissions" }` |
| **3** | `/api/products` | `POST` | 👑 Admin Token | `201 Created`<br>`{ "success": true, "message": "Product created successfully", ... }` |
| **4** | `/api/upload` | `POST` | ❌ ไม่ใส่ Token | `401 Unauthorized`<br>`{ "success": false, "message": "Access token is required" }` |
| **5** | `/api/upload` | `POST` | 👤 User Token | `200 OK`<br>`{ "success": true, "message": "อัปโหลดรูปภาพสำเร็จ (Base64)", ... }` |
| **6** | `/api/upload` | `POST` | 👑 Admin Token | `200 OK`<br>`{ "success": true, "message": "อัปโหลดรูปภาพสำเร็จ (Base64)", ... }` |
| **7** | `/api/products/:id` | `PUT` | 👤 User Token | `403 Forbidden`<br>`{ "success": false, "message": "Access denied: Insufficient permissions" }` |
| **8** | `/api/products/:id` | `PUT` | 👑 Admin Token | `200 OK`<br>`{ "success": true, "message": "Product updated successfully", ... }` |
| **9** | `/api/products/:id`| `DELETE` | 👤 User Token | `403 Forbidden`<br>`{ "success": false, "message": "Access denied: Insufficient permissions" }` |
| **10**| `/api/products/:id`| `DELETE` | 👑 Admin Token | `200 OK`<br>`{ "success": true, "message": "Product deleted successfully" }` |

---

### 8.3 ตัวอย่าง Postman Request (JSON & cURL)

#### 1. อัปโหลดรูปภาพ (User & Admin สามารถใช้ได้)
**cURL:**
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <USER_OR_ADMIN_TOKEN>" \
  -d '{
    "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "filename": "profile_avatar.png"
  }'
```

#### 2. เพิ่มสินค้า (Admin Only)
**cURL:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "prod_name": "Mechanical Keyboard RGB",
    "price": 2590,
    "cate_id": "cate_0001",
    "description": "Gaming mechanical keyboard blue switch",
    "in_stock": true,
    "stock_count": 15
  }'
```

