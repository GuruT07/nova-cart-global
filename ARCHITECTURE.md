# System Architecture & Mathematical Models

This document outlines the core algorithms, state management logic, and stochastic simulation models powering the Nova Cart Global application.

---

## 1. The Probabilistic Trust Engine

The core value proposition of the system is identifying "Ghost Stock"—items that the database claims are in stock, but are probabilistically likely to be out of stock by the time the picker goes to the shelf.

### 1.1 The Risk Score Algorithm
The confidence of any given SKU `i` at store `s` is continuously evaluated using the following function:

```javascript
Risk(i, s) = (Δt * W_t) + (C_s * W_c) + (V_i * W_v) - (S_i * W_s)
```
Where:
* `Δt` = Time since the SKU stock was last electronically verified (in hours).
* `C_s` = The historical baseline cancellation rate of store `s`.
* `V_i` = The empirical sales velocity (items sold per hour) of SKU `i`.
* `S_i` = The absolute volume of stated stock currently in the database for SKU `i`.
* `W` = Weighted constants tuned to the specific logistics network.

### 1.2 Confidence Bounds
Once the absolute Risk Score is computed, it is bucketed into actionable confidence thresholds:
* **High Confidence (Risk < 40):** Safe to allow standard 1-click checkout.
* **Medium Confidence (40 ≤ Risk < 70):** Flagged internally, but allowed to proceed.
* **Low Confidence (Risk ≥ 70):** Triggers the AI Rescue Engine intercept mechanism.

---

## 2. AI Rescue Intercept Routing

When a SKU hits `Low Confidence`, standard checkout is disabled. The system initiates a bipartite graph search to find the optimal rescue vector.

### 2.1 Route A: Geospatial Swap (Store Sharding)
If the exact SKU `i` is required, the system queries all stores `S` within the user's localized geofence (e.g., "Bangalore").
```javascript
const nearbyStore = S.find(store => 
   store.city === user.city && 
   store.id !== activeStore.id && 
   Confidence(i, store) === 'High'
);
```
If a `High Confidence` match is found, the order fulfillment routing is silently hot-swapped to the neighboring hub.

### 2.2 Route B: Substitute Matrix
If no nearby store has high confidence for the exact SKU, the system queries the `substituteId` graph. If a mapped substitute exists within the *current* active store and holds a `High` or `Medium` confidence, it is offered to the user as a 1-click swap in the UI.

---

## 3. Monte Carlo Business Simulator (`BusinessImpact.jsx`)

To prove ROI to executive stakeholders, the system features a stochastic Monte Carlo simulator that runs entirely in the browser's JavaScript V8 engine.

### 3.1 Simulation Loop
The engine executes `N = 500` random mock orders in a tight loop.

For each order `O_k`:
1. A random item from the 120-SKU master list is selected.
2. A random store from the 12-store global network is selected.
3. The true stock state is randomized against the store's baseline cancellation probability distribution.

### 3.2 Standard Run (Control Group)
If the true stock is `0` but the user ordered it, the order is flagged as `CANCELLED`.
* Lost Revenue = `₹486` (AOV)
* Support Ticket Generated = `15% probability`

### 3.3 Rescue Run (Experimental Group)
If the true stock is `0`, the AI Rescue Intercept (Section 2) is triggered. 
The simulation mathematically guarantees a `75% success rate` that the user will accept the AI Substitute or the cross-store routing will succeed.
If successful, the cancellation is averted, and the revenue is logged as `PROTECTED`.

### 3.4 Hardware Acceleration
Because the simulation can block the main thread, the visual output (the `Chart.js` Line Graph) is buffered and rendered post-calculation using the GPU-accelerated HTML5 `<canvas>` API via `react-chartjs-2`.
