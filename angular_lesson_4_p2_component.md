# Lesson 4: Transforming Project 2 (`p2`) into an Angular Component

In Project 2 (`p2/app2.html` and `p2/app2.js`), we moved beyond the browser console and rendered customer cards onto the page using **imperative DOM manipulation** (`document.getElementById`, `document.createElement('div')`, `cardDiv.innerHTML`, and `container.appendChild`).

In this lesson, we transform `p2` into the **`P2Dom`** Angular component (`<app-p2-dom>`), sharing the exact same [`Customer`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/models/customer.ts) interface and [`CustomerService`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/services/customer.ts) as `P1Console`.

---

## Key Teaching Concept: Imperative DOM vs. Declarative Templates

| Task | In `p2/app2.js` (Imperative Vanilla JS) | In `P2Dom` (Declarative Angular) |
| :--- | :--- | :--- |
| **Find Container** | `const container = document.getElementById('customer-container')` | No DOM lookup needed; the HTML template *is* the view |
| **Create Card Element** | `const cardDiv = document.createElement('div')` | `<div class="customer-card">` inside `@for` block |
| **Populate Card Content** | `cardDiv.innerHTML = \`<h2>${fullName}...</h2>\`` | Angular interpolation: `<h2>{{ customer.firstName }}...</h2>` |
| **Insert into Page** | `container.appendChild(cardDiv)` | Automatic! Angular renders and updates the DOM when the Signal changes |

---

## Step 1: Generate the `p2-dom` Component

Inside your `customer-app` folder, run the Angular CLI generator:

```bash
ng generate component p2-dom
```

This creates `src/app/p2-dom/p2-dom.ts`, `p2-dom.html`, `p2-dom.css`, and `p2-dom.spec.ts`.

---

## Step 2: Connect the Component to `Customer` and `CustomerService`

Open [`src/app/p2-dom/p2-dom.ts`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/p2-dom/p2-dom.ts). Notice how we import the exact same `Customer` interface and `CustomerService` we built earlier, and we zero out all manual DOM manipulation code—leaving only data access and the console report in `ngOnInit()`:

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { Customer } from '../models/customer';
import { CustomerService } from '../services/customer';

@Component({
  selector: 'app-p2-dom',
  imports: [],
  templateUrl: './p2-dom.html',
  styleUrl: './p2-dom.css',
})
export class P2Dom implements OnInit {
  // 1. Inject the shared CustomerService (same singleton instance used by P1Console)
  private customerService = inject(CustomerService);

  // 2. Expose the read-only Signal of Customer[] directly to our HTML template
  customers = this.customerService.customers;

  // 3. Preserve the console report from App 2 when the component initializes
  ngOnInit(): void {
    const customerList: Customer[] = this.customers();
    console.log('=== CUSTOMER DATA REPORT (Angular P2 DOM Component) ===\n\n');

    for (const customer of customerList) {
      const id = customer.customerId;
      const fullName = `${customer.firstName} ${customer.lastName}`;
      const email = customer.email;
      const phone = customer.phone;
      const address = `${customer.address}, ${customer.city}, ${customer.state} ${customer.zipCode}`;
      const status = customer.status;

      console.log(`Customer ID: ${id}`);
      console.log(`Name:        ${fullName}`);
      console.log(`Contact:     ${email} | ${phone}`);
      console.log(`Address:     ${address}`);
      console.log(`Status:      ${status}`);
      console.log('--------------------------------------------------');
    }

    console.log(`\nTotal Customers Rendered to DOM: ${customerList.length}`);
  }
}
```

---

## Step 3: Replace `createElement` & `innerHTML` with an Angular Template

In `p2/app2.js`, lines 95–111 manually constructed each `<div class="customer-card">` using string concatenation and `appendChild`. In [`src/app/p2-dom/p2-dom.html`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/p2-dom/p2-dom.html), we express the exact same layout directly in HTML using `@for`:

```html
<div class="p2-wrapper">
  <h1>Customer Directory (Angular P2 Component)</h1>

  <div class="instruction">
    <p>
      This component transforms <code>p2/app2.html</code> &amp; <code>p2/app2.js</code>: it reads from
      <code>CustomerService</code>, logs the report to the Developer Console, and declaratively renders
      strictly-typed <code>Customer</code> cards to the DOM without <code>document.createElement</code>!
    </p>
  </div>

  <!-- Replaces document.getElementById('customer-container') and appendChild() -->
  <div id="customer-container">
    @for (customer of customers(); track customer.customerId) {
      <div class="customer-card">
        <h2>
          {{ customer.firstName }} {{ customer.lastName }}
          <span>(#{{ customer.customerId }})</span>
        </h2>
        <p><strong>Contact:</strong> {{ customer.email }} | {{ customer.phone }}</p>
        <p>
          <strong>Address:</strong>
          {{ customer.address }}, {{ customer.city }}, {{ customer.state }} {{ customer.zipCode }}
        </p>
        <span class="status status-{{ customer.status.toLowerCase() }}">
          {{ customer.status }}
        </span>
      </div>
    } @empty {
      <div class="customer-card">
        <p>No customer records available.</p>
      </div>
    }
  </div>
</div>
```

---

## Step 4: Migrate the Scoped Styles from `p2/app2.html`

Copy the styles from `p2/app2.html` into [`src/app/p2-dom/p2-dom.css`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/p2-dom/p2-dom.css):

```css
.p2-wrapper {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: #121212;
  color: #e0e0e0;
  padding: 40px;
}

h1 { color: #bb86fc; text-align: center; }

.instruction {
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #333;
  margin: 0 auto 30px auto;
  max-width: 800px;
  text-align: center;
}

#customer-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.customer-card {
  background-color: #1e1e1e;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.customer-card h2 { margin: 0 0 10px 0; color: #03dac6; font-size: 1.4rem; }
.customer-card h2 span { font-size: 1rem; color: #888; }
.customer-card p { margin: 5px 0; color: #b0b0b0; }

.customer-card .status {
  display: inline-block;
  margin-top: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
}

.status-active { background-color: #1b5e20; color: #a5d6a7; }
.status-inactive { background-color: #b71c1c; color: #ef9a9a; }
.status-pending { background-color: #f57f17; color: #fff59d; }
```

---

## Step 5: Mount `<app-p2-dom>` in the Root Component

Update [`src/app/app.ts`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/app.ts) and [`src/app/app.html`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/app.html) so both `P1Console` and `P2Dom` are imported and rendered:

**`src/app/app.ts`:**
```typescript
import { Component, signal } from '@angular/core';
import { P1Console } from './p1-console/p1-console';
import { P2Dom } from './p2-dom/p2-dom';
import { TestCustomer } from './test-customer/test-customer';

@Component({
  selector: 'app-root',
  imports: [P1Console, P2Dom, TestCustomer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('customer-app');
}
```

**`src/app/app.html`:**
```html
<main style="min-height: 100vh; background-color: #121212; display: flex; flex-direction: column;">
  <app-p1-console></app-p1-console>
  <app-p2-dom></app-p2-dom>
</main>
```
