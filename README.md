# Vui Học Toán 🎓

Ứng dụng ôn tập toán tiểu học (lớp 1-5) cho trẻ em, theo chương trình **Chân Trời Sáng Tạo**. Hoạt động hoàn toàn offline, không quảng cáo, không thu thập dữ liệu.

🌐 **Trang web**: https://hoanggia87.github.io/mathfun
🔒 **Privacy**: https://hoanggia87.github.io/mathfun/privacy.html
🆘 **Hỗ trợ**: https://hoanggia87.github.io/mathfun/support.html

---

## ✨ Tính năng chính

- 📚 **Lớp 1-5** với 50+ dạng bài tập theo SGK
- 🎯 **3 dạng câu hỏi**: điền số, trắc nghiệm, toán giải
- ⭐ **Hệ thống sao** (1-3 sao theo độ chính xác)
- 🎡 **Vòng quay may mắn** đổi điểm thưởng
- 🎁 **Đổi quà** do phụ huynh cấu hình
- 👨‍👩‍👧 **Khu phụ huynh** bảo vệ bằng PIN, quản lý nhiều bé
- 🔒 **100% offline**, không quảng cáo, không IAP

---

## 🛠 Tech Stack

- **Framework**: Expo SDK 54 (React Native 0.81 + React 19)
- **Language**: TypeScript (strict mode)
- **Navigation**: React Navigation 7 (native stack)
- **State**: Zustand
- **DB**: expo-sqlite (5 tables, migrations, seed defaults)
- **Animations**: react-native-reanimated 4
- **Icons**: @expo/vector-icons (Ionicons)
- **Font**: Baloo 2 (Google Fonts, full Vietnamese support)
- **Audio/Haptic**: expo-haptics
- **Image picker**: expo-image-picker

---

## 📂 Cấu trúc

```
src/
├── theme/                  # colors, typography, spacing
├── lib/
│   ├── db/                 # SQLite + migrations + CRUD
│   ├── questions/
│   │   ├── curriculum.ts   # 50+ topics map theo lớp + HK
│   │   ├── generators/     # template generators (g1-g5)
│   │   ├── bank/           # word problems JSON
│   │   ├── mixer.ts        # combine generators + auto MC conversion
│   │   └── rng.ts
│   └── audio.ts            # haptic feedback
├── store/                  # Zustand: profile, session
├── components/             # Avatar, Button, NumberPad, LuckyWheel, ...
├── navigation/             # types
└── screens/
    ├── Profiles, Home, Semester, TopicSelect, Practice, Result, Wheel, Rewards
    └── parent/             # Gate, Settings, ProfilesEdit, RewardsEdit, WheelConfig, History, Pin

assets/                     # icon, splash, adaptive icon (auto-generated)
docs/                       # GitHub Pages: landing, privacy, support, marketing
scripts/                    # generate-assets.mjs (icon/splash builder)
```

---

## 🚀 Phát triển

```bash
npm install
npx expo start --go        # Mở Expo Go mode
# Bấm i để mở iOS Simulator, a cho Android
```

### Generate icon & splash
```bash
node scripts/generate-assets.mjs
```

### Build production
```bash
# Cài EAS CLI nếu chưa có
npm install -g eas-cli
eas login

# Build IPA cho iOS
eas build --platform ios --profile production

# Submit lên App Store Connect
eas submit --platform ios
```

---

## 📦 Database Schema

| Table | Purpose |
|---|---|
| `profiles` | Hồ sơ bé (name, avatar, grade, total_points) |
| `sessions` | Lịch sử bài làm (correct/wrong/streak/duration/stars) |
| `rewards` | Quà phụ huynh cấu hình |
| `reward_redemptions` | Lịch sử đổi quà |
| `wheel_segments` | Cấu hình ô vòng quay |
| `app_settings` | PIN, sound on/off |

Migrations tự động chạy khi mở DB lần đầu, idempotent.

---

## 🎨 Brand colors

- Primary (cam): `#FF8A00`
- Accent (hồng): `#FF6B9D`
- Bg (vàng kem): `#FFF8E1`
- Success (xanh lá): `#52B788`
- Star (vàng): `#FFC107`

---

## 📝 License

Proprietary — © 2026 Vui Học Toán. All rights reserved.
