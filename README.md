# Thirumala Brokers - Logistics Management System

A modern Next.js application for managing sellers and lorry details for Thirumala Brokers.

## Features

- ✅ **Seller Management**: Add, view, and delete seller information
- ✅ **Lorry Tracking**: Manage lorry details with automatic commission calculations
- ✅ **Responsive Design**: Works seamlessly on desktop and mobile devices
- ✅ **Dark Mode Support**: Toggle between light and dark themes
- ✅ **Form Validation**: Client-side validation for all forms
- ✅ **Real-time Calculations**: Automatic total commission computation

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Material Symbols
- **Forms**: React Hook Form for validation

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd e:\Projects_Vikrin\Thirumala_Broker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser and navigate to**
   ```
   http://localhost:3000
   ```

## Project Structure

```
thirumala-brokers/
├── app/
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx           # Root layout component
│   └── page.tsx            # Main page component
├── components/
│   ├── Header.tsx          # Header with navigation
│   ├── SellerForm.tsx      # Seller management form
│   ├── LorryForm.tsx       # Lorry details form
│   └── DataTable.tsx       # Data display with tabs
├── package.json
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── next.config.js         # Next.js configuration
```

## Key Components

### SellerForm
- Add new sellers with name, address, and mobile number
- Form validation for required fields
- Automatic form reset after submission

### LorryForm
- Select seller from dropdown
- Add comprehensive lorry details
- Real-time commission calculation (Quantity × Commission)
- Date pickers for unload and buying dates

### DataTable
- Tabbed interface for sellers and lorries
- Edit and delete functionality
- Responsive table design
- Currency formatting for amounts

## Customization

### Colors
The app uses a custom color palette defined in `tailwind.config.js`:
- **Primary**: `#135bec` (Blue)
- **Background Light**: `#f6f6f8`
- **Background Dark**: `#101622`

### Fonts
- **Display Font**: Manrope (Google Fonts)
- **Material Icons**: Material Symbols Outlined

## Deployment

### For Vercel (Recommended)

1. **Push your code to GitHub**
2. **Connect your GitHub repository to Vercel**
3. **Deploy automatically with zero configuration**

### Build for Production

```bash
npm run build
npm start
```

## Future Enhancements

- [ ] Backend API integration with PHP
- [ ] MongoDB database connection
- [ ] User authentication
- [ ] Advanced reporting features
- [ ] Export functionality (PDF/Excel)
- [ ] Search and filtering
- [ ] Edit functionality for existing records

## API Integration Ready

The components are structured to easily integrate with a PHP backend API:

```typescript
// Example API calls structure
const addSeller = async (seller) => {
  const response = await fetch('/api/sellers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(seller)
  })
  return response.json()
}
```

## Support

For any questions or support, please contact the development team.

---

Built with ❤️ for Thirumala Brokers