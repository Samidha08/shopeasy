# ShopEasy

ShopEasy is a frontend-only ecommerce application built as a production-grade React assignment. It demonstrates a complete shopping journey using real product data from DummyJSON, client-side state management with Redux Toolkit, persisted cart/auth/wishlist/order state, protected routes, Razorpay Checkout in test mode, and a responsive plain-CSS UI.

The project does not include a backend. Authentication, product data, and mock write operations are powered by DummyJSON, while checkout is simulated through Razorpay test checkout plus a demo-success fallback so the complete user flow can be reviewed end-to-end.

## Live Demo

[View ShopEasy on Vercel](https://shopeasy-samidha08s-projects.vercel.app/)

## Features

- Premium ecommerce landing page with hero, category highlights, trending products, promotional banner, testimonials, newsletter, and footer.
- Product listing with URL-synchronized search, filters, sorting, and pagination.
- Navbar autocomplete search with debounced product suggestions, keyboard navigation, and direct Product Details navigation.
- Product Detail page with image gallery, quantity selection, cart actions, and wishlist actions.
- Cart page and responsive cart drawer with quantity updates, item removal, order summary, and persisted cart state.
- Wishlist page with persisted wishlist state and move-to-cart support.
- Authentication flow using DummyJSON login, persisted auth state, protected checkout and order routes.
- Checkout flow with address capture, review step, Razorpay Checkout test integration, demo-success fallback, and cart clearing on successful order creation.
- Order confirmation and order history pages with persisted order data.
- Toast notifications for key user actions.
- Responsive design using plain CSS and project design tokens.

## Screenshots



| Page | Screenshot |
| --- | --- |
| Landing Page | `docs/screenshots/LandingPage.png` |
| Products Listing | `docs/screenshots/ProductListing.png` |
| Product Details | `docs/screenshots/ProductDetails.png` |
| Cart Drawer | `docs/screenshots/CartDrawer.png` |
| Wishlist | `docs/screenshots/Wishlist.png` |
| Login | `docs/screenshots/Login.png` |

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | React |
| Build Tool | Vite |
| Language | JavaScript |
| Routing | React Router v6 |
| State Management | Redux Toolkit |
| Data Fetching | RTK Query |
| Persistence | redux-persist |
| Notifications | react-toastify |
| Payments | Razorpay Checkout test mode |
| Data Source | DummyJSON |
| Styling | Plain CSS with design tokens |
| Deployment | Vercel |

## Prerequisites

- Node.js 18 or later
- npm 9 or later
- Razorpay test key ID
- Internet access for DummyJSON and Razorpay Checkout scripts

## Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/Samidha08/shopeasy.git
cd shopeasy
npm install
```

Create an environment file for local development:

```bash
cp .env.dev .env.local
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown by Vite, usually:

```text
http://localhost:5173/
```

## Environment Variables

The app validates required Vite environment variables at runtime.

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `VITE_APP_NAME` | Yes | Application name | `ShopEasy` |
| `VITE_ENV` | Yes | Runtime environment. Must be `dev`, `nonprod`, or `prod`. | `dev` |
| `VITE_API_BASE_URL` | Yes | DummyJSON API base URL | `https://dummyjson.com` |
| `VITE_RAZORPAY_KEY_ID` | Yes | Razorpay test key ID | `rzp_test_xxxxxxxx` |
| `VITE_ENABLE_LOGS` | Yes | Enables or disables client logs. Must be `true` or `false`. | `true` |

Example `.env.local`:

```env
VITE_APP_NAME=ShopEasy
VITE_ENV=dev
VITE_API_BASE_URL=https://dummyjson.com
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
VITE_ENABLE_LOGS=true
```

Supported `VITE_ENV` values:

```text
dev
nonprod
prod
```

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Starts Vite in `dev` mode. |
| `npm run start:nonprod` | Starts Vite in `nonprod` mode. |
| `npm run build:dev` | Creates a development-mode production build. |
| `npm run build:nonprod` | Creates a non-production build. |
| `npm run build:prod` | Creates a production build. |
| `npm run lint` | Runs ESLint across the project. |
| `npm run preview` | Serves the latest Vite build locally. |

## Folder Structure

```text
shopeasy/
|-- public/
|-- src/
|   |-- assets/
|   |-- components/
|   |   |-- Footer.jsx
|   |   `-- Navbar.jsx
|   |-- config/
|   |   |-- constants.js
|   |   `-- env.js
|   |-- features/
|   |   |-- auth/
|   |   |-- cart/
|   |   |-- checkout/
|   |   |-- orders/
|   |   |-- products/
|   |   `-- wishlist/
|   |-- hooks/
|   |-- layouts/
|   |-- routes/
|   |   |-- index.jsx
|   |   |-- ProtectedRoute.jsx
|   |   `-- routePaths.js
|   |-- stores/
|   |   |-- baseApi.js
|   |   |-- persistConfig.js
|   |   |-- rootReducer.js
|   |   `-- store.js
|   |-- styles/
|   |   |-- tokens.css
|   |   |-- global.css
|   |   |-- navbar.css
|   |   |-- products.css
|   |   |-- cart.css
|   |   |-- checkout.css
|   |   |-- wishlist.css
|   |   |-- auth.css
|   |   `-- footer.css
|   |-- utils/
|   |   |-- currency.js
|   |   `-- razorpay.js
|   |-- App.jsx
|   `-- main.jsx
|-- index.html
|-- package.json
|-- vite.config.js
`-- README.md
```

## Architecture Highlights

- Feature-based structure keeps auth, products, cart, wishlist, checkout, and orders isolated under `src/features`.
- RTK Query APIs are injected into a shared `baseApi`, keeping network configuration centralized.
- Redux Toolkit slices own local UI and domain state for cart, wishlist, auth, orders, and common UI.
- `redux-persist` persists cart, wishlist, auth, and order state across refreshes.
- React Router v6 manages public and protected pages, with intended-destination redirects for protected routes.
- URL query parameters are the source of truth for product search, category filters, sort order, and pagination.
- Plain CSS files are organized by surface area and reuse global design tokens from `tokens.css`.
- Razorpay integration is isolated in `src/utils/razorpay.js`.

## Documentation Links

Project documents can be added under a `docs/` directory.

| Document | Link |
| --- | --- |
| Product Requirements Document (PRD) | `docs/ShopEasy_PRD.pdf` |
| Architecture Decision Record (ADR) | `docs/ShopEasy_ADR.pdf` |

## Design Decisions and Trade-offs

- The project is frontend-only to keep the assignment focused on React architecture, UI state, API integration, routing, persistence, and checkout flow.
- DummyJSON provides realistic product and authentication endpoints, but authentication and write APIs are mock and do not persist server-side changes.
- Cart, wishlist, auth, and orders are persisted locally with `redux-persist` to provide a complete ecommerce experience without a backend.
- URL-synchronized search, filters, sorting, and pagination make product listing states shareable and refresh-safe.
- Razorpay Checkout is integrated using the real client-side checkout script in test mode. Merchant onboarding/KYC is incomplete, so a demo-success fallback is included to showcase the full checkout and order-confirmation journey.
- Styling uses plain CSS instead of a UI framework to demonstrate layout, responsiveness, and design-system discipline without additional dependencies.
- Order creation is client-side only, so order history is suitable for demo purposes but not production commerce.

## Testing the Full User Flow

Use the following flow to validate the application manually:

1. Open the live demo or local dev server.
2. Browse the landing page and navigate to Products.
3. Use navbar search autocomplete and press Enter or select a suggestion.
4. Apply category filters, sorting, and pagination on the Products page.
5. Open a Product Details page.
6. Add a product to cart.
7. Add a product to wishlist and move it from wishlist to cart.
8. Open the cart drawer, update quantities, and remove an item.
9. Log in using DummyJSON test credentials configured for the project.
10. Proceed to checkout.
11. Fill the address form.
12. Review cart totals and click Pay Now.
13. Complete Razorpay test checkout or use the demo-success fallback.
14. Confirm that the order confirmation page displays order details.
15. Visit Order History.
16. Refresh the page and verify that cart, wishlist, auth, and orders persist as expected.

## Browser Support

ShopEasy targets modern evergreen browsers:

| Browser | Support |
| --- | --- |
| Google Chrome | Latest |
| Microsoft Edge | Latest |
| Mozilla Firefox | Latest |
| Safari | Latest |
| Mobile Chrome | Latest |
| Mobile Safari | Latest |

Internet Explorer is not supported.

## Known Limitations

- No backend server is included.
- DummyJSON authentication is mock and should not be treated as production authentication.
- DummyJSON write APIs do not persist real server-side data.
- Razorpay is configured for test/demo checkout only.
- Order history is persisted in browser storage and is not shared across devices.
- Inventory, taxes, shipping rates, coupons, and refunds are not implemented.
- Registration is intentionally unavailable.
- Role-based access control and refresh tokens are not implemented.

## Roadmap / Future Improvements

- Add a backend for real users, carts, orders, inventory, and payments.
- Replace mock authentication with secure server-managed authentication.
- Add server-side order creation before payment confirmation.
- Add coupon codes, shipping rules, tax calculation, and invoice generation.
- Add product reviews and ratings submission.
- Add unit, integration, and end-to-end tests.
- Add accessibility audits and keyboard-flow improvements.
- Add loading skeletons and optimistic UI refinements.
- Add analytics for search, checkout drop-off, and product engagement.

## Contributing

Contributions are welcome for learning, review, and portfolio improvement.

```bash
git checkout -b feature/your-feature-name
npm install
npm run lint
npm run build:dev
```

Before opening a pull request:

- Keep changes scoped.
- Do not introduce new libraries unless there is a clear reason.
- Follow the existing feature-based architecture.
- Ensure lint and build pass.
- Update documentation when behavior changes.

## License

This project is currently intended for educational and portfolio use. Add a formal license file before using it for commercial or open-source distribution.

## Acknowledgements

- [DummyJSON](https://dummyjson.com/) for product and mock auth APIs.
- [Razorpay](https://razorpay.com/) for test checkout integration.
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management and RTK Query.
- [React Router](https://reactrouter.com/) for client-side routing.
- [Vite](https://vite.dev/) for fast development and builds.
