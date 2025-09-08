# Theme System Documentation

## Tổng quan

Theme system được thiết kế để cung cấp một cách nhất quán và dễ bảo trì để quản lý styles trong toàn bộ ứng dụng. Thay vì mỗi component có `StyleSheet.create` riêng, chúng ta sử dụng theme chung.

## Cấu trúc thư mục

```
src/theme/
├── index.ts              # Export tất cả theme
├── colors.ts             # Bảng màu chung
├── typography.ts         # Font, size, weight
├── spacing.ts            # Spacing, layout constants
├── shadows.ts            # Shadow system
├── commonStyles.ts       # Styles chung dùng nhiều
├── componentStyles.ts    # Styles cho từng component
└── README.md             # Tài liệu này
```

## Cách sử dụng

### 1. Import theme

```typescript
// Import tất cả
import { COLORS, SPACING, TYPOGRAPHY, COMMON_STYLES, COMPONENT_STYLES } from '../theme';

// Hoặc import từng phần
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
```

### 2. Sử dụng trong component

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, COMMON_STYLES } from '../theme';

const MyComponent = () => {
  return (
    <View style={[COMMON_STYLES.container, styles.customContainer]}>
      <Text style={[TYPOGRAPHY.h4, styles.customText]}>
        Hello World
      </Text>
    </View>
  );
};

// Chỉ giữ styles riêng biệt
const styles = StyleSheet.create({
  customContainer: {
    backgroundColor: COLORS.background.secondary,
    padding: SPACING.lg,
  },
  customText: {
    color: COLORS.primary.main,
    textAlign: 'center',
  },
});

export default MyComponent;
```

### 3. Sử dụng component styles có sẵn

```typescript
import { COMPONENT_STYLES } from '../theme';

// Sử dụng styles có sẵn
<View style={COMPONENT_STYLES.card}>
  <Text style={COMPONENT_STYLES.tripRoute}>Route Name</Text>
</View>

// Kết hợp với styles riêng
<View style={[COMPONENT_STYLES.card, styles.customCard]}>
  <Text style={[COMPONENT_STYLES.tripRoute, styles.customRoute]}>
    Custom Route
  </Text>
</View>
```

## Các loại styles

### 1. **Colors** (`colors.ts`)
- Primary, secondary, success, warning, error colors
- Neutral colors (gray scale)
- Text, background, border colors
- Status colors (active, inactive, etc.)
- Bus-specific colors

```typescript
// Sử dụng
backgroundColor: COLORS.primary.main
color: COLORS.text.primary
borderColor: COLORS.border.light
```

### 2. **Typography** (`typography.ts`)
- Font families (iOS/Android compatible)
- Font sizes (xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl)
- Font weights (light, normal, medium, semibold, bold, extrabold)
- Predefined text styles (h1, h2, h3, body1, body2, button, etc.)

```typescript
// Sử dụng
style={TYPOGRAPHY.h4}
style={TYPOGRAPHY.body1}
style={TYPOGRAPHY.button}
```

### 3. **Spacing** (`spacing.ts`)
- Base spacing units (xs: 4, sm: 8, md: 16, lg: 24, xl: 32, etc.)
- Layout constants (header height, tab height, etc.)
- Border radius, border width
- Icon sizes, avatar sizes

```typescript
// Sử dụng
padding: SPACING.md
margin: SPACING.lg
borderRadius: LAYOUT.borderRadius.md
height: LAYOUT.headerHeight
```

### 4. **Shadows** (`shadows.ts`)
- Platform-specific shadows (iOS shadowColor, Android elevation)
- Light, medium, heavy shadows
- Special shadows (card, button, header, modal, etc.)

```typescript
// Sử dụng
...COMMON_SHADOWS.card
...COMMON_SHADOWS.button
...COMMON_SHADOWS.header
```

### 5. **Common Styles** (`commonStyles.ts`)
- Layout containers (container, safeArea, content)
- Flex utilities (row, column, center)
- Spacing utilities (margin, padding)
- Card, button, input styles
- Loading, error, empty state styles

```typescript
// Sử dụng
style={COMMON_STYLES.container}
style={COMMON_STYLES.row}
style={COMMON_STYLES.card}
style={COMMON_STYLES.button}
```

### 6. **Component Styles** (`componentStyles.ts`)
- Search components (form, input, button)
- Trip components (card, header, route, price)
- Booking components (card, header, status)
- Seat components (grid, seat states)
- Location components (item, icon, info)
- Form components (container, title, group, label, input, button)
- Header, tab, modal, list, chip components
- Loading, error, empty state components

```typescript
// Sử dụng
style={COMPONENT_STYLES.tripCard}
style={COMPONENT_STYLES.searchForm}
style={COMPONENT_STYLES.bookingCard}
```

## Best Practices

### 1. **Ưu tiên sử dụng theme có sẵn**
```typescript
// ✅ Tốt - Sử dụng theme
style={[COMMON_STYLES.card, { marginTop: SPACING.lg }]}

// ❌ Không tốt - Tạo mới hoàn toàn
style={{
  backgroundColor: '#ffffff',
  borderRadius: 12,
  padding: 16,
  margin: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
}}
```

### 2. **Kết hợp styles**
```typescript
// Kết hợp theme với styles riêng
style={[
  COMMON_STYLES.card,
  COMPONENT_STYLES.tripCard,
  styles.customCard
]}
```

### 3. **Sử dụng constants thay vì hardcode**
```typescript
// ✅ Tốt
padding: SPACING.md
fontSize: TYPOGRAPHY.h4.fontSize
color: COLORS.primary.main

// ❌ Không tốt
padding: 16
fontSize: 20
color: '#1976d2'
```

### 4. **Tạo styles riêng chỉ khi cần thiết**
```typescript
const styles = StyleSheet.create({
  // Chỉ giữ styles thực sự riêng biệt
  customAnimation: {
    transform: [{ rotate: '45deg' }],
  },
  specificLayout: {
    position: 'absolute',
    top: 100,
    left: 50,
  },
});
```

## Migration từ StyleSheet cũ

### Trước (StyleSheet cũ):
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
});
```

### Sau (Sử dụng theme):
```typescript
import { COMMON_STYLES, COMPONENT_STYLES, TYPOGRAPHY, SPACING } from '../theme';

const styles = StyleSheet.create({
  // Chỉ giữ styles riêng biệt
  customTitle: {
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
});

// Sử dụng trong component
<View style={[COMMON_STYLES.container, { padding: SPACING.lg }]}>
  <View style={COMPONENT_STYLES.card}>
    <Text style={[TYPOGRAPHY.h4, styles.customTitle]}>
      Title
    </Text>
  </View>
</View>
```

## Lợi ích

### ✅ **Consistency**
- Tất cả components sử dụng cùng colors, spacing, typography
- UI nhất quán trong toàn bộ app

### ✅ **Maintainability**
- Thay đổi theme ở một nơi, áp dụng cho toàn bộ app
- Dễ dàng update design system

### ✅ **Reusability**
- Styles được tái sử dụng, không duplicate code
- Giảm kích thước bundle

### ✅ **Developer Experience**
- IntelliSense support
- Type safety với TypeScript
- Dễ dàng tìm và sửa styles

### ✅ **Performance**
- Styles được tối ưu hóa
- Giảm memory usage

## Ví dụ thực tế

Xem các component đã được migrate để hiểu cách sử dụng theme system trong thực tế.
