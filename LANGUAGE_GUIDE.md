# Hướng Dẫn Sử Dụng Chức Năng Đa Ngôn Ngữ (i18n)

## 📋 Tổng Quan

Ứng dụng đã được tích hợp đầy đủ chức năng đa ngôn ngữ (tiếng Việt ↔ tiếng Anh) với:
- ✅ LanguageContext để quản lý ngôn ngữ
- ✅ File translations.js chứa tất cả bản dịch
- ✅ LanguageSwitcher component để chuyển đổi
- ✅ Lưu ngôn ngữ vào localStorage

## 🚀 Cách Sử Dụng

### 1. Trong Component

```jsx
import { useLanguage } from '../context/LanguageContext';

function MyComponent() {
  const { language, changeLanguage, t } = useLanguage();
  
  return (
    <div>
      <h1>{t.dashboard.candidate.title}</h1>
      <p>{t.dashboard.candidate.welcome}</p>
      
      {/* Chuyển đổi ngôn ngữ */}
      <button onClick={() => changeLanguage('vi')}>Tiếng Việt</button>
      <button onClick={() => changeLanguage('en')}>English</button>
    </div>
  );
}
```

### 2. Sử dụng LanguageSwitcher Component

```jsx
import LanguageSwitcher from './components/LanguageSwitcher';

function Navbar() {
  return (
    <nav>
      <LanguageSwitcher />
    </nav>
  );
}
```

### 3. Thêm Bản Dịch Mới

Mở file `src/locales/translations.js` và thêm:

```javascript
export const translations = {
  vi: {
    myNewSection: {
      title: 'Tiêu đề mới',
      description: 'Mô tả bằng tiếng Việt'
    }
  },
  en: {
    myNewSection: {
      title: 'New Title',
      description: 'Description in English'
    }
  }
};
```

## 📍 Vị Trí Các File

```
src/
├── context/
│   └── LanguageContext.jsx      # Context quản lý ngôn ngữ
├── locales/
│   └── translations.js          # File chứa tất cả bản dịch
└── components/
    └── LanguageSwitcher.jsx     # Component nút chuyển đổi ngôn ngữ
```

## 🎯 Các Tính Năng

1. **Tự động lưu ngôn ngữ**: Ngôn ngữ được lưu vào localStorage
2. **Chuyển đổi nhanh**: Click vào nút VI/EN trên Navbar
3. **Cài đặt chi tiết**: Vào Settings để chọn ngôn ngữ với giao diện đẹp
4. **Hỗ trợ đầy đủ**: Tất cả trang đã được dịch sẵn

## 💡 Ví Dụ Sử Dụng

### Hiển thị text theo ngôn ngữ:
```jsx
const { t } = useLanguage();
<h1>{t.landing.hero.title}</h1>
```

### Kiểm tra ngôn ngữ hiện tại:
```jsx
const { language, isVietnamese, isEnglish } = useLanguage();

if (isVietnamese) {
  // Làm gì đó cho tiếng Việt
}
```

### Chuyển đổi ngôn ngữ:
```jsx
const { changeLanguage } = useLanguage();
changeLanguage('en'); // Chuyển sang tiếng Anh
changeLanguage('vi'); // Chuyển sang tiếng Việt
```

## 🎨 Giao Diện

- **Navbar**: Nút VI/EN ở góc phải
- **Settings**: Trang cài đặt có section chọn ngôn ngữ với cờ 🇻🇳 🇬🇧

## ✨ Đã Hoàn Thành

✅ LanguageContext đã tạo
✅ Translations đã đầy đủ cho tất cả trang
✅ LanguageSwitcher component đã tạo
✅ Đã tích hợp vào Navbar
✅ Settings page đã có chức năng chuyển đổi
✅ Lưu ngôn ngữ vào localStorage

Bạn có thể bắt đầu sử dụng ngay! 🎉
