# System Requirement Specification (SRS)

## โครงการ: ระบบจัดการสินค้า (Product Management System)
**เทคโนโลยีหลัก:** React Native (Expo) สำหรับ Frontend และ Express.js + MySQL สำหรับ Backend

---

## 1. ความต้องการทางฝั่ง Frontend (React Native / Expo)

### 1.1 ระบบค้นหาและกรองข้อมูล (Search & Filter)
* **SearchBar:** มีช่องรับข้อมูลสำหรับการค้นหาสินค้าด้วยคีย์เวิร์ด
* **Debounce:** ระบบหน่วงเวลาการพิมพ์ประมาณ 300ms ก่อนส่ง API Request เพื่อลดภาระของเซิร์ฟเวอร์
* **Clear Search:** รองรับการล้างคำค้นหาและแสดงจำนวนผลลัพธ์ที่ค้นพบ
* **UI State Management:** มีการจัดการและแสดงผลสถานะต่างๆ ได้แก่ สถานะกำลังโหลด (Loading), ไม่พบข้อมูล (Empty State), และเกิดข้อผิดพลาด (Fetch Error)

### 1.2 การแสดงผลสินค้า (Product Listing & Details)
* **รายการสินค้า:** แสดงรายการสินค้าประกอบด้วย รูปภาพ, ราคา, จำนวนสต็อก (เช่น Low stock, ACTIVE), แบรนด์, และรหัสสินค้า
* **รายละเอียดสินค้า:** แสดงข้อมูลเชิงลึกเมื่อกดดูสินค้า เช่น ขนาด (Sizes), สถานะ, และที่ตั้งร้านค้า (Location/Stores)

### 1.3 การจัดการข้อมูลสินค้า (Delete Product)
* **ปุ่มลบสินค้า:** มีปุ่มลบสินค้าในหน้ารายการหรือหน้ารายละเอียด
* **Role-Based UI:** ซ่อนปุ่มแก้ไข (Edit) และปุ่มลบ (Delete) สำหรับผู้ใช้งานทั่วไป จะแสดงผลเฉพาะผู้ใช้ระดับ Admin เท่านั้น
* **Confirmation Dialog:** มีระบบแจ้งเตือนยืนยันก่อนลบ (ใช้ Alert ของ Native บนมือถือ และ `window.confirm` บนเว็บ)
* **Disable State:** ปิดการทำงานของปุ่มระหว่างรอการประมวลผลลบ เพื่อป้องกันการกดซ้ำ
* **Real-time UI Update:** อัปเดตรายการสินค้าออกจากหน้าจอทันทีเมื่อลบข้อมูลสำเร็จ

### 1.4 การยืนยันตัวตน (Authentication & Token Handling)
* **JWT Authorization:** แนบ `Authorization: Bearer <token>` ไปกับ API Request ทุกครั้งที่เรียกใช้งาน
* **Session Management:** หาก Token หมดอายุหรือถูกปฏิเสธ (401 Unauthorized) ระบบจะเคลียร์ข้อมูล State และพากลับไปยังหน้า Login โดยอัตโนมัติ

---

## 2. ความต้องการทางฝั่ง Backend (Express.js + MySQL)

### 2.1 API สำหรับดึงข้อมูลสินค้า (GET `/api/products`)
* **Search Query:** รองรับ Parameter `?q=...` สำหรับค้นหาข้อมูลแบบครอบคลุมหลายคอลัมน์ (เช่น รหัสสินค้า, ชื่อ, หมวดหมู่, รายละเอียด, สี, ขนาด, สถานที่)
* **Pagination:** รองรับการแบ่งหน้าข้อมูลผ่าน Parameter `page` และ `limit`
* **Response Format:** คืนค่าเป็น JSON ในรูปแบบ `{ items, total, page, limit }`

### 2.2 API สำหรับลบข้อมูลสินค้า (DELETE `/api/products/:id`)
* **Validation:** ตรวจสอบความถูกต้องของ `:id` และค้นหาสินค้าในฐานข้อมูลก่อนทำการลบ (หากไม่พบ คืนค่า `404 Not Found`)
* **Response:** เมื่อลบสำเร็จ คืนค่า `{ success: true, message: 'Product deleted successfully' }`
* **File Cleanup (Optional):** รองรับการลบไฟล์รูปภาพที่เกี่ยวข้องในโฟลเดอร์ `/uploads` แบบ Non-blocking

### 2.3 การรักษาความปลอดภัย (Security & Middleware)
* **JWT Middleware:** ตรวจสอบความถูกต้องของ Token ก่อนอนุญาตให้เข้าถึง API
* **Role Authorization (`requireAdmin`):** ตรวจสอบสิทธิ์ผู้ใช้งาน ว่าเป็น Admin หรือไม่ สำหรับ API ที่เกี่ยวกับการลบและแก้ไข (หากไม่ใช่ คืนค่า `403 Forbidden`)
* **SQL Injection Prevention:** ใช้งาน Prepared Statements ในการ Query ข้อมูล

### 2.4 ฐานข้อมูล (Database & Indexing - MySQL)
* **Schema:** เก็บข้อมูลสินค้าที่จำเป็น เช่น `id`, `name`, `price`, `stock`, `category`, `brand`, `productCode`, `status`, `lastUpdate` เป็นต้น
* **Indexing:** มีการสร้าง Index ในคอลัมน์ที่ถูกค้นหาบ่อย เช่น `name`, `brand`, `category`, `productCode`
* **FULLTEXT Search (Optional):** รองรับ FULLTEXT Index สำหรับการค้นหาข้อความที่ซับซ้อนและมีประสิทธิภาพสูงขึ้น
