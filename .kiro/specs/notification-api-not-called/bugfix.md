# Bugfix Requirements Document

## Introduction

Khi employer mua gói subscription thành công, hệ thống đã trừ tiền từ wallet và tạo subscription record, nhưng không tạo notification cho Admin trong bảng Notifications của DynamoDB. Điều này khiến Admin không nhận được thông báo về yêu cầu mua gói mới, ảnh hưởng đến quy trình phê duyệt và kích hoạt gói dịch vụ.

Code đã có logic gọi `createPackagePurchaseRequestNotification()` tại dòng 756 trong file `Subscription.jsx`, nhưng notification không xuất hiện trong database và không hiển thị trên Navbar hoặc AdminDashboard.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN employer hoàn tất mua gói subscription (sau khi trừ tiền từ wallet) THEN hệ thống gọi `createPackagePurchaseRequestNotification()` nhưng notification không được tạo trong bảng Notifications của DynamoDB

1.2 WHEN `createPackagePurchaseRequestNotification()` được gọi với đầy đủ thông tin (subscriptionId, employerId, companyName, packageName, duration, price) THEN API call có thể bị fail hoặc trả về lỗi mà không được xử lý đúng cách

1.3 WHEN notification API được gọi THEN có thể xảy ra các vấn đề: CORS error, network timeout, API endpoint không hoạt động, hoặc environment variable `VITE_NOTIFICATIONS_API` không được load đúng

1.4 WHEN notification được tạo (nếu API call thành công) THEN notification có thể không có `recipientId='admin'` và `recipientRole='admin'` đúng format, khiến Admin không thể query được

### Expected Behavior (Correct)

2.1 WHEN employer hoàn tất mua gói subscription THEN hệ thống SHALL tạo một notification với `type='package_purchase_request'` trong bảng Notifications của DynamoDB

2.2 WHEN notification được tạo THEN notification SHALL có `recipientId='admin'` và `recipientRole='admin'` để Admin có thể query và hiển thị

2.3 WHEN notification được tạo thành công THEN notification SHALL chứa đầy đủ thông tin: `companyName`, `packageName`, `duration`, `price`, `subscriptionId`, `employerId`

2.4 WHEN notification được tạo THEN Admin SHALL thấy notification mới xuất hiện trong Navbar (unread count tăng) và trong AdminDashboard

2.5 WHEN API call thất bại THEN hệ thống SHALL log chi tiết lỗi (error message, status code, response body) và hiển thị cảnh báo cho employer

### Unchanged Behavior (Regression Prevention)

3.1 WHEN employer mua gói thành công THEN hệ thống SHALL CONTINUE TO trừ tiền từ wallet balance chính xác

3.2 WHEN employer mua gói thành công THEN hệ thống SHALL CONTINUE TO tạo subscription record trong bảng subscriptions

3.3 WHEN employer mua gói thành công THEN hệ thống SHALL CONTINUE TO hiển thị success modal cho employer

3.4 WHEN employer có balance không đủ THEN hệ thống SHALL CONTINUE TO hiển thị insufficient balance modal và không cho phép mua gói

3.5 WHEN notification API được gọi cho các loại notification khác (package_approved, etc.) THEN hệ thống SHALL CONTINUE TO hoạt động bình thường
