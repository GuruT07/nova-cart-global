# 🛒 Nova Cart Global: Smart Rescue Engine Simulator

![Vercel](https://therealsujit.rest/api/badge?label=Deployment&status=Vercel&color=black)
![React](https://img.shields.io/badge/React-18.x-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-4.x-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

Nova Cart Global is an enterprise-grade, frontend-heavy simulator built to visualize and quantify the business impact of **AI-driven inventory rescue mechanisms** in global Fast-Moving Consumer Goods (FMCG) logistics. 

It simulates a live marketplace where stock confidence is calculated probabilistically in real-time. When a user requests an item that is mathematically likely to be out-of-stock (despite the database claiming it is available), the system dynamically intervenes to save the order.

---

## 🌟 Executive Summary

In high-volume e-commerce environments (like quick-commerce or grocery delivery), inventory latency between localized fulfillment hubs and the master database leads to silent out-of-stock errors. This results in **order cancellations, lost revenue, and high customer support ticket volumes**.

This application solves that by introducing the **AI Rescue Engine**. 

When a user attempts to view a `Low Confidence` item, the system dynamically intervenes to offer either a hyper-local substitute or cross-routes the request to a nearby fulfillment hub—saving the order, protecting the revenue, and maintaining user trust.

---

## 🏗 Architecture & Tech Stack

This project is built purely as a **Single Page Application (SPA)** with zero external backend dependencies. All data is procedurally generated locally, allowing the mathematical models to run entirely in the browser's memory without network latency.

* **Core Framework:** React 18 + Vite
* **UI / UX Design:** Custom CSS-in-JS + Premium Glassmorphism & Drop-shadow Framework
* **Data Visualization:** Chart.js + React-ChartJS-2 (Hardware Accelerated)
* **Iconography:** Lucide React
* **Data Seeding:** Node.js procedural generation script (`seed.js`)

For deep technical specifications on the mathematical models, please see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## ⚙️ Core Modules

### 1. The Customer App (Front-End UI)
A highly optimized, consumer-facing storefront interface. 
* Real-time search across 120 unique FMCG SKUs.
* Dynamic **Confidence Badges** (High, Medium, Low) injected directly onto the product cards.
* **AI Rescue Overlays:** When an item drops into `Low Confidence`, the standard "Add to Cart" button is intercepted and replaced with a dynamic AI Rescue alert, offering a 1-click swap to a substitute.

### 2. Store Trust Matrix (Operations Dashboard)
An internal operations dashboard designed for regional managers.
* Features a global real-time **Inventory Risk Doughnut Chart** rendering data for all 1,440 active inventory permutations.
* A live tabular matrix evaluating 12 global fulfillment hubs across metrics like *Update Frequency, Cancellation Rate, Fulfillment Score, and Customer Rating*.

### 3. Business Impact (Executive Simulator)
A high-level executive dashboard featuring a **Monte Carlo Simulation Engine**. 
* Runs 500 stochastic order simulations in the browser.
* Mathematically calculates the business impact of running the marketplace with the Rescue Engine turned **ON** vs **OFF**.
* Outputs hard financial metrics: **Revenue Protected (₹), Cancellations Avoided, and Support Tickets Saved**.

---

## 🚀 Local Development Setup

Because the application is a self-contained SPA, setup is instant.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GuruT07/nova-cart-global.git
   cd nova-cart-global
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Generate fresh synthetic data (Optional):**
   *The system ships with pre-seeded data, but you can generate a new randomized inventory permutation state by running:*
   ```bash
   node seed.js
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🌍 Production Deployment

This application is configured for zero-config deployments to Vercel. 
Simply run:
```bash
npm i -g vercel
vercel --prod
```

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.