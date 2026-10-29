# Lesson 5: Transforming Project 3 (`p3`) into an Angular Component (`P3Form`)

In Project 3 (`p3/app3.html` and `p3/app3.js`), we introduced an **Add New Customer** form. In Vanilla JS, adding a customer required:
1. Calling `document.getElementById('...').value` 10 separate times to read each input.
2. Pushing the untyped object to a local array.
3. Calling `document.getElementById('...').value = ''` 9 separate times to clear the inputs.
4. Manually calling `renderCustomers()` to wipe `container.innerHTML = ''` and rebuild every DOM card from scratch.

In this lesson, we transform `p3` into the **`P3Form`** Angular component (`<app-p3-form>`), introducing **Two-Way Data Binding (`[(ngModel)]`)** and mutating the shared [`CustomerService`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/services/customer.ts).

---

## Key Teaching Concept: Manual DOM Queries vs. Two-Way Data Binding

| Task | In `p3/app3.js` (Vanilla JS) | In `P3Form` (Angular) |
| :--- | :--- | :--- |
| **Read Form Inputs** | `document.getElementById('inputFirstName').value` (x10) | `[(ngModel)]="newCustomer.firstName"` (automatically synced!) |
| **Type Safety** | Untyped object literal | `newCustomer: Customer` enforced by [`Customer`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/models/customer.ts) interface |
| **Update State** | `customers.push(newCustomer)` | `this.customerService.addCustomer({ ...this.newCustomer })` |
| **Clear Form Inputs** | `document.getElementById('...').value = ''` (x9) | `this.newCustomer = this.createEmptyCustomer()` |
| **Re-render DOM** | `container.innerHTML = ''` + `renderCustomers()` | **Zero code!** Angular's Signal updates `P3Form`, `P2Dom`, and `P1Console` simultaneously |

---

## Step 1: Generate the `p3-form` Component

Inside your `customer-app` folder, run:

```bash
ng generate component p3-form
```

---

## Step 2: Import `FormsModule` & Connect `CustomerService`

To use `[(ngModel)]` in a standalone Angular component, we import `FormsModule` from `@angular/forms`. Open [`src/app/p3-form/p3-form.ts`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/p3-form/p3-form.ts) and add the form state and `addCustomer()` method:

```typescript
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Customer } from '../models/customer';
import { CustomerService } from '../services/customer';

@Component({
  selector: 'app-p3-form',
  // Teaching Moment: FormsModule unlocks [(ngModel)] two-way data binding!
  imports: [FormsModule],
  templateUrl: './p3-form.html',
  styleUrl: './p3-form.css',
})
export class P3Form {
  private customerService = inject(CustomerService);
  customers = this.customerService.customers;

  // Strictly-typed form state object (replaces 10 document.getElementById calls)
  newCustomer: Customer = this.createEmptyCustomer();

  addCustomer(): void {
    // Push a copy of the form state into the shared CustomerService Signal
    this.customerService.addCustomer({ ...this.newCustomer });

    // Reset all form inputs in one line
    this.newCustomer = this.createEmptyCustomer();
  }

  private createEmptyCustomer(): Customer {
    return {
      customerId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      status: 'Active',
    };
  }
}
```

> [!IMPORTANT]
> Look at [`CustomerService.addCustomer()`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/services/customer.ts#L81-L83):
> ```typescript
> addCustomer(newCustomer: Customer) {
>   this.customerData.update(currentList => [...currentList, newCustomer]);
> }
> ```
> Because `customerData` is a Signal in a singleton service (`providedIn: 'root'`), calling `addCustomer()` from `<app-p3-form>` immediately updates the customer count in `<app-p1-console>` and adds the new card in `<app-p2-dom>` and `<app-p3-form>` at the same time!

---

## Step 3: Bind the Form Inputs with `[(ngModel)]`

In [`src/app/p3-form/p3-form.html`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/p3-form/p3-form.html), we replace every `id="input..."` attribute from `p3/app3.html` with `[(ngModel)]="newCustomer.<property>"` ("banana-in-a-box" syntax for two-way binding) and replace `onclick="addCustomer()"` with `(click)="addCustomer()"`:

```html
<div class="p3-wrapper">
  <h1>Customer Directory App (Angular P3 Component)</h1>

  <div class="instruction">
    <p>
      Fill out the form to add a new customer. Thanks to <code>[(ngModel)]</code> and
      <code>CustomerService</code> Signals, the page (and every other component sharing the service)
      re-renders automatically!
    </p>
  </div>

  <div class="form-container">
    <h2>Add New Customer</h2>

    <div class="input-group">
      <label>Customer ID</label>
      <input type="text" [(ngModel)]="newCustomer.customerId" placeholder="CUST-006" />
    </div>
    <div class="input-group">
      <label>Status</label>
      <select [(ngModel)]="newCustomer.status">
        <option value="Active">Active</option>
        <option value="Pending">Pending</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>

    <div class="input-group">
      <label>First Name</label>
      <input type="text" [(ngModel)]="newCustomer.firstName" placeholder="Jane" />
    </div>
    <div class="input-group">
      <label>Last Name</label>
      <input type="text" [(ngModel)]="newCustomer.lastName" placeholder="Doe" />
    </div>

    <div class="input-group">
      <label>Email</label>
      <input type="email" [(ngModel)]="newCustomer.email" placeholder="jane@example.com" />
    </div>
    <div class="input-group">
      <label>Phone</label>
      <input type="text" [(ngModel)]="newCustomer.phone" placeholder="555-0199" />
    </div>

    <div class="input-group">
      <label>Address</label>
      <input type="text" [(ngModel)]="newCustomer.address" placeholder="123 Main St" />
    </div>
    <div class="input-group">
      <label>City</label>
      <input type="text" [(ngModel)]="newCustomer.city" placeholder="Los Angeles" />
    </div>

    <div class="input-group">
      <label>State</label>
      <input type="text" [(ngModel)]="newCustomer.state" placeholder="CA" />
    </div>
    <div class="input-group">
      <label>Zip Code</label>
      <input type="text" [(ngModel)]="newCustomer.zipCode" placeholder="90001" />
    </div>

    <button (click)="addCustomer()">Add Customer to Array</button>
  </div>

  <div id="customer-container">
    @for (customer of customers(); track customer.customerId) {
      <div class="customer-card">
        <h3>
          {{ customer.firstName }} {{ customer.lastName }}
          <span>(#{{ customer.customerId }})</span>
        </h3>
        <p><strong>Contact:</strong> {{ customer.email }} | {{ customer.phone }}</p>
        <p>
          <strong>Address:</strong>
          {{ customer.address }}, {{ customer.city }}, {{ customer.state }} {{ customer.zipCode }}
        </p>
        <span class="status status-{{ customer.status.toLowerCase() }}">
          {{ customer.status }}
        </span>
      </div>
    }
  </div>
</div>
```

---

## Step 4: Copy Scoped Form & Card Styles

Copy the `.form-container`, `.input-group`, `button`, and `.customer-card` CSS from `p3/app3.html` into [`src/app/p3-form/p3-form.css`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/p3-form/p3-form.css).

---

## Step 5: Mount `<app-p3-form>` in `App`

Register `P3Form` in [`src/app/app.ts`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/app.ts) and add `<app-p3-form></app-p3-form>` in [`src/app/app.html`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/app.html).
