# Lesson 3: Transforming Project 1 (`p1`) into an Angular Component

In this lesson, we will take our very first Vanilla JavaScript project (`p1/index.html` and `p1/script.js`)—which parsed a 5-customer JSON dataset and printed a formatted report to the browser console—and transform it into a reusable, strictly-typed **Angular Component** (`P1Console`) connected to our `Customer` interface and `CustomerService`.

---

## Architecture Comparison: Vanilla JS (`p1`) vs. Angular

| Responsibility | In `p1` (Vanilla JS) | In Angular (`customer-app`) |
| :--- | :--- | :--- |
| **Data Shape** | Implicit (untyped JSON strings) | Strictly enforced by [`Customer`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/models/customer.ts) interface |
| **Data Storage** | Local `rawJsonData` inside `p1/script.js` | Centralized Signal inside [`CustomerService`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/services/customer.ts) |
| **HTML Structure** | Full document in `p1/index.html` | Component template in [`p1-console.html`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/p1-console/p1-console.html) |
| **Styling** | `<style>` block in `<head>` | Scoped styles in [`p1-console.css`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/p1-console/p1-console.css) |
| **Startup Execution** | `<script src="script.js">` runs immediately | `ngOnInit()` lifecycle hook in [`p1-console.ts`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/p1-console/p1-console.ts) |

---

## Step 1: Populate `CustomerService` with the Full `p1` Dataset

In `p1/customers.json`, we had 5 customer records (`CUST-001` through `CUST-005`). Instead of keeping raw JSON inside a page script, we store all 5 records in `src/app/services/customer.ts`:

```typescript
import { Injectable, signal } from '@angular/core';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customerData = signal<Customer[]>([
    {
      customerId: 'CUST-001',
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice.smith@example.com',
      phone: '555-0101',
      address: '123 Maple St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      status: 'Active'
    },
    {
      customerId: 'CUST-002',
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.j@example.com',
      phone: '555-0102',
      address: '456 Oak Ave',
      city: 'Metropolis',
      state: 'NY',
      zipCode: '10001',
      status: 'Inactive'
    },
    {
      customerId: 'CUST-003',
      firstName: 'Carol',
      lastName: 'Williams',
      email: 'carol.w@example.com',
      phone: '555-0103',
      address: '789 Pine Rd',
      city: 'Gotham',
      state: 'NJ',
      zipCode: '07001',
      status: 'Active'
    },
    {
      customerId: 'CUST-004',
      firstName: 'David',
      lastName: 'Brown',
      email: 'dbrown@example.com',
      phone: '555-0104',
      address: '321 Elm St',
      city: 'Star City',
      state: 'CA',
      zipCode: '90210',
      status: 'Active'
    },
    {
      customerId: 'CUST-005',
      firstName: 'Eve',
      lastName: 'Davis',
      email: 'eve.davis@example.com',
      phone: '555-0105',
      address: '654 Birch Blvd',
      city: 'Central City',
      state: 'OH',
      zipCode: '43215',
      status: 'Pending'
    }
  ]);

  customers = this.customerData.asReadonly();
}
```

---

## Step 2: Generate the `p1-console` Component

From inside the `customer-app` folder, run the Angular CLI component generator:

```bash
ng generate component p1-console
```

This creates four files inside `src/app/p1-console/`:
* `p1-console.ts` (Component class & logic)
* `p1-console.html` (HTML template)
* `p1-console.css` (Scoped CSS styles)
* `p1-console.spec.ts` (Unit test file)

---

## Step 3: Implement the Component Logic & `ngOnInit` Lifecycle Hook

In Vanilla JS (`p1/script.js`), our `for...of` loop executed globally as soon as the browser downloaded the script. In Angular, components have a structured **Lifecycle**. When we want code to run automatically as soon as a component initializes, we implement the `OnInit` interface and define an `ngOnInit()` method.

Open `src/app/p1-console/p1-console.ts` and update it:

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { Customer } from '../models/customer';
import { CustomerService } from '../services/customer';

@Component({
  selector: 'app-p1-console',
  imports: [],
  templateUrl: './p1-console.html',
  styleUrl: './p1-console.css',
})
export class P1Console implements OnInit {
  // 1. Inject the shared CustomerService
  private customerService = inject(CustomerService);

  // 2. Reference the read-only Signal from the service
  customers = this.customerService.customers;

  // 3. Lifecycle Hook: Runs automatically when the component initializes
  ngOnInit(): void {
    this.printCustomerReport();
  }

  // 4. Unpack the strictly-typed Customer array and print to console
  printCustomerReport(): void {
    const customerList: Customer[] = this.customers();

    console.log('=== CUSTOMER DATA REPORT (Angular P1 Component) ===\n\n');

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

    console.log(`\nTotal Customers Processed: ${customerList.length}`);
  }
}
```

> [!TIP]
> Because `customerList` is typed as `Customer[]`, your code editor provides autocomplete for `.customerId`, `.firstName`, `.status`, and every other property—and immediately flags any typos!

---

## Step 4: Migrate the HTML Template & Add Event Binding

Next, take the `<body>` contents from `p1/index.html` and place them into `src/app/p1-console/p1-console.html`. Notice that we also enhance it with two Angular features:
1. **`{{ customers().length }}`** to dynamically show how many records were loaded from the service.
2. **`(click)="printCustomerReport()"`** to let the user re-run the console report on button click.

```html
<div class="p1-wrapper">
  <h1>Angular Project 1: JSON &amp; Service Console Parser</h1>

  <div class="instruction">
    <p>
      The <code>P1Console</code> Angular component has initialized and read
      <strong>{{ customers().length }}</strong> strictly-typed <code>Customer</code> records from
      <code>CustomerService</code>.
    </p>
    <p>
      Please open the <strong>Developer Console</strong> in your Chrome browser to view the
      formatted customer data.
    </p>
    <p>
      <small>(Shortcut: <code>Cmd + Option + J</code> on Mac or <code>Ctrl + Shift + J</code> on Windows)</small>
    </p>

    <button class="btn-reprint" (click)="printCustomerReport()">
      Re-Print Report to Console
    </button>
  </div>
</div>
```

---

## Step 5: Migrate the Scoped CSS

Copy the styles from `p1/index.html` into `src/app/p1-console/p1-console.css`. In Angular, component CSS is **scoped automatically**—meaning these styles will only affect `P1Console` and won't leak into other components!

```css
.p1-wrapper {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: #121212;
  color: #e0e0e0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

h1 { color: #bb86fc; }
p { font-size: 1.15rem; max-width: 600px; margin: 10px auto; }

.instruction {
  background-color: #1e1e1e;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #333;
  margin-top: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

code {
  background-color: #2c2c2c;
  padding: 4px 8px;
  border-radius: 4px;
  color: #03dac6;
}

.btn-reprint {
  margin-top: 16px;
  padding: 10px 18px;
  background-color: #bb86fc;
  color: #000;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  font-size: 0.95rem;
  cursor: pointer;
}
.btn-reprint:hover { background-color: #9965f4; }
```

---

## Step 6: Register and Render `<app-p1-console>` in the Root App

Finally, import `P1Console` inside `src/app/app.ts` and place `<app-p1-console></app-p1-console>` inside `src/app/app.html`:

**`src/app/app.ts`:**
```typescript
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { P1Console } from './p1-console/p1-console';
import { TestCustomer } from './test-customer/test-customer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, P1Console, TestCustomer],
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
  <app-test-customer></app-test-customer>
</main>
```

Open **`http://localhost:4200`** and inspect the Chrome Developer Console (`Cmd + Option + J`)—you will see all 5 customer records formatted in the console just like `p1`, while also rendered in the DOM below via `TestCustomer`!
