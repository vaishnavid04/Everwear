# Everwear Product Images Guide

## 📸 Image Requirements

### **Recommended Image Specifications:**
- **Format**: JPG or PNG
- **Size**: 800x800px (square) or 800x1000px (portrait)
- **Quality**: High resolution, well-lit product photos
- **Background**: Clean white or neutral background preferred

### **Naming Convention:**
Use descriptive names that match your products:
- `tshirt-black.jpg`
- `tshirt-white.jpg` 
- `crop-top-grey.jpg`
- `sweatshirt-cream.jpg`
- `sweatpants-brown.jpg`

## 📁 **Required Images (8 total)**

Place your product images in this folder with these suggested names:

### **T-Shirts (2 images)**
- `tshirt-1.jpg` - Essential T-Shirt (Product ID: 1)
- `tshirt-2.jpg` - Essential T-Shirt (Product ID: 2)

### **Crop Tops (2 images)**
- `crop-top-1.jpg` - Essential Crop Top (Product ID: 3)
- `crop-top-2.jpg` - Essential Crop Top (Product ID: 4)

### **Sweatshirts (2 images)**
- `sweatshirt-1.jpg` - Essential Sweatshirt (Product ID: 5)
- `sweatshirt-2.jpg` - Essential Sweatshirt (Product ID: 6)

### **Sweatpants (2 images)**
- `sweatpants-1.jpg` - Essential Sweatpants (Product ID: 7)
- `sweatpants-2.jpg` - Essential Sweatpants (Product ID: 8)

## 🔄 **After Adding Images**

1. Place your 8 product images in this folder
2. Run the update script (see instructions below)
3. Refresh your browser to see the new images

## 📝 **Manual Update Instructions**

If you prefer to update manually, edit these files:
- `src/pages/CategoryPage.tsx` (lines 16, 26, 38, 48, 60, 70, 82, 92)
- `src/pages/ProductPage.tsx` (lines 16, 26, 38, 47, 60, 68, 82, 89)

Replace the imageUrl values with your local paths:
```typescript
// Change from:
imageUrl: 'https://images.unsplash.com/photo-...',

// To:
imageUrl: '/images/your-image-name.jpg',
```

## 💡 **Tips**
- Images will be automatically served from `/images/` URL path
- Make sure image names match exactly (case-sensitive)
- Test one image first to make sure it works
- Keep backup copies of your original images
