# Lesson 7: Transforming Project 6 (`p6`) into an Angular Component (`P6Crud`)

In Project 6 (`p6/app6.html` and `p6/app6.js`), we unified our user experience. Instead of maintaining two separate forms (an "Add Form" fixed on the page and an "Edit Form" inside a popup dialog as in `p5`), we consolidated both workflows into a **single, reusable modal dialog**.

In this lesson, we will transform `p6` into the **`P6Crud`** Angular component (`<app-p6-crud>`), introducing **declarative modal visibility via `@if`**, **shallow copying of form state**, and adding `updateCustomer()` to [`CustomerService`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/services/customer.ts).

---

## Architecture Comparison: Vanilla JS (`p6`) vs. Modern Angular

| Concern | In `p6/app6.js` (Vanilla JS) | In `P6Crud` & `CustomerService` (Angular) |
| :--- | :--- | :--- |
| **Modal Visibility** | `document.getElementById('customerModal').style.display = 'flex'` / `'none'` | Declarative **`@if (isModalOpen())`** block |
| **Backdrop Dismissal** | Click event listeners on window or overlay | `(click)="closeModal()"` on backdrop + `(click)="$event.stopPropagation()"` on modal content |
| **Mode Tracking** | Global variable `let currentEditIndex = null` | Component property `currentEditIndex: number \| null = null` |
| **Editing Data Safety** | Manual reading/writing of 10 DOM input values | `this.formData = { ...customer }` (editing in a copy prevents dirty mutations before save) |
| **Updating State** | `customers[currentEditIndex] = formData` + `renderCustomers()` | `this.customerService.updateCustomer(index, updatedCustomer)` (Signals auto-render across all views) |

---

## Step 1: Add `updateCustomer()` to `CustomerService`

Open [`src/app/services/customer.ts`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/services/customer.ts). We need a method to update an existing customer at a specific index without mutating the array in-place. We use JavaScript's immutable `.map()` inside `this.customerData.update(...)`:

```typescript
  // UPDATE (Introduced in P6)
  // Replaces customers[currentEditIndex] = formData + renderCustomers() from p6/app6.js
  updateCustomer(indexToUpdate: number, updatedCustomer: Customer): void {
    this.customerData.update(currentList =>
      currentList.map((customer, index) =>
        index === indexToUpdate ? updatedCustomer : customer
      )
    );
  }
```

> [!NOTE]
> Because `updateCustomer()` returns a fresh array reference through `this.customerData.update()`, Angular's Signals immediately detect the change and notify any component displaying that customer.

---

## Step 2: Generate the `p6-crud` Component

From your terminal inside `customer-app`, run:

```bash
ng generate component p6-crud
```

This creates `src/app/p6-crud/p6-crud.ts`, `p6-crud.html`, `p6-crud.css`, and `p6-crud.spec.ts`.

---

## Step 3: Implement `P6Crud` Component Logic

Open [`src/app/p6-crud/p6-crud.ts`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/p6-crud/p6-crud.ts). Here we manage:
1. `isModalOpen = signal(false)` to control modal visibility.
2. `currentEditIndex: number | null` to identify whether we are adding (`null`) or editing (`number`).
3. `formData: Customer` as the two-way bound model for our modal inputs.
4. `saveCustomer()` to conditionally delegate to either `addCustomer()` or `updateCustomer()` on the service.

```typescript
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Customer } from '../models/customer';
import { CustomerService } from '../services/customer';

@Component({
  selector: 'app-p6-crud',
  imports: [FormsModule],
  templateUrl: './p6-crud.html',
  styleUrl: './p6-crud.css',
})
export class P6Crud {
  // 1. Inject the shared CustomerService
  private customerService = inject(CustomerService);

  // 2. Read-only Signal of Customer[] for rendering the cards
  customers = this.customerService.customers;

  // 3. Modal visibility state tracked reactively with a Signal
  isModalOpen = signal(false);

  // 4. Index tracker: null = 'Create' mode, number = 'Edit' mode
  currentEditIndex: number | null = null;

  // 5. Dual-purpose form state bound via [(ngModel)]
  formData: Customer = this.createEmptyCustomer();

  // Open modal in either Create mode (index === null) or Edit mode (index !== null)
  openModal(index: number | null = null): void {
    this.currentEditIndex = index;

    if (index !== null) {
      // EDIT MODE: Populate form with a copy of existing customer data
      const customer = this.customers()[index];
      this.formData = { ...customer };
    } else {
      // ADD MODE: Initialize form with blank fields
      this.formData = this.createEmptyCustomer();
    }

    this.isModalOpen.set(true);
  }

  // Close modal and reset tracker
  closeModal(): void {
    this.isModalOpen.set(false);
    this.currentEditIndex = null;
    this.formData = this.createEmptyCustomer();
  }

  // Unified Save: Handles both Create and Update based on currentEditIndex
  saveCustomer(): void {
    if (this.currentEditIndex !== null) {
      // UPDATE: Overwrite existing customer at currentEditIndex
      this.customerService.updateCustomer(this.currentEditIndex, {
        ...this.formData,
      });
      console.log('Customer updated at index ' + this.currentEditIndex);
    } else {
      // CREATE: Append new customer to the Signal store
      this.customerService.addCustomer({ ...this.formData });
      console.log(
        'New customer added! Total customers: ' + this.customers().length
      );
    }

    this.closeModal();
  }

  // Delete customer record via CustomerService
  deleteCustomer(indexToRemove: number): void {
    this.customerService.deleteCustomer(indexToRemove);
    console.log('Customer deleted at index ' + indexToRemove);
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

> [!TIP]
> **Why do we write `this.formData = { ...customer };`?**
> If we assigned `this.formData = customer;` directly, two-way binding (`[(ngModel)]`) would modify the customer card in real time as the user types *before* they click "Save Customer"! Creating a shallow copy ensures changes are only committed when "Save Customer" is clicked.

---

## Step 4: Declarative Modal Template with `@if`

Open [`src/app/p6-crud/p6-crud.html`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/p6-crud/p6-crud.html).

Key features to observe:
1. **`@if (isModalOpen())`**: The modal DOM elements exist *only* while the modal is open.
2. **Backdrop Click Dismissal**: The overlay has `(click)="closeModal()"`, while the content box has `(click)="$event.stopPropagation()"` to prevent clicks inside the form from closing the modal.
3. **Dynamic Text**: Ternary expressions dynamically toggle the modal title (`{{ currentEditIndex !== null ? 'Edit Customer' : 'Add New Customer' }}`) and save button label.

```html
<div class="p6-wrapper">
  <div class="instruction">
    <p>
      Version 6: Unified Experience. Creating and Updating are now handled by a single, dynamic form
      using Angular <code>&#64;if</code> and <code>[(ngModel)]</code>. Code is cleaner and the UI is sleeker!
    </p>
  </div>

  <div class="header">
    <h1>Customer Directory (Angular P6 Component)</h1>
    <button class="btn-primary" (click)="openModal()">+ Add Customer</button>
  </div>

  <!-- Dynamic List Container -->
  <div id="customer-container">
    @for (customer of customers(); track customer.customerId) {
      <div class="customer-card">
        <h3>
          {{ customer.firstName }} {{ customer.lastName }}
          <span>(#{{ customer.customerId }})</span>
        </h3>

        <div class="card-actions">
          <button class="action-btn edit-btn" (click)="openModal($index)">Edit</button>
          <button class="action-btn delete-btn" (click)="deleteCustomer($index)">Delete</button>
        </div>

        <p><strong>Contact:</strong> {{ customer.email }} | {{ customer.phone }}</p>
        <p>
          <strong>Address:</strong>
          {{ customer.address }}, {{ customer.city }}, {{ customer.state }} {{ customer.zipCode }}
        </p>
        <span class="status status-{{ customer.status.toLowerCase() }}">{{ customer.status }}</span>
      </div>
    } @empty {
      <div class="customer-card">
        <p>No customer records available. Click "+ Add Customer" above to create one!</p>
      </div>
    }
  </div>

  <!-- Single Unified Modal Rendered Declaratively via @if -->
  @if (isModalOpen()) {
    <div id="customerModal" class="modal-overlay" (click)="closeModal()">
      <!-- Stop click propagation so clicking inside the form does not close it -->
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h2 id="modalTitle">
          {{ currentEditIndex !== null ? 'Edit Customer' : 'Add New Customer' }}
        </h2>

        <div class="input-group">
          <label>Customer ID</label>
          <input type="text" [(ngModel)]="formData.customerId" placeholder="CUST-006" />
        </div>
        <div class="input-group">
          <label>Status</label>
          <select [(ngModel)]="formData.status">
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div class="input-group">
          <label>First Name</label>
          <input type="text" [(ngModel)]="formData.firstName" placeholder="Jane" />
        </div>
        <div class="input-group">
          <label>Last Name</label>
          <input type="text" [(ngModel)]="formData.lastName" placeholder="Doe" />
        </div>

        <div class="input-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="formData.email" placeholder="jane@example.com" />
        </div>
        <div class="input-group">
          <label>Phone</label>
          <input type="text" [(ngModel)]="formData.phone" placeholder="555-0199" />
        </div>

        <div class="input-group full-width">
          <label>Address</label>
          <input type="text" [(ngModel)]="formData.address" placeholder="123 Main St" />
        </div>
        <div class="input-group">
          <label>City</label>
          <input type="text" [(ngModel)]="formData.city" placeholder="Los Angeles" />
        </div>
        <div class="input-group">
          <label>State</label>
          <input type="text" [(ngModel)]="formData.state" placeholder="CA" />
        </div>
        <div class="input-group">
          <label>Zip Code</label>
          <input type="text" [(ngModel)]="formData.zipCode" placeholder="90001" />
        </div>

        <div class="modal-actions">
          <button class="btn-secondary" (click)="closeModal()">Cancel</button>
          <button class="btn-primary" (click)="saveCustomer()">
            {{ currentEditIndex !== null ? 'Save Changes' : 'Save Customer' }}
          </button>
        </div>
      </div>
    </div>
  }
</div>
```

---

## Step 5: Scoped Styles

Open [`src/app/p6-crud/p6-crud.css`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/p6-crud/p6-crud.css) and add the modal layout, card styling, and grid forms:

```css
.p6-wrapper {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: #121212;
  color: #e0e0e0;
  padding: 40px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  margin: 0 auto 30px auto;
}

h1 { color: #bb86fc; margin: 0; }

.instruction {
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #333;
  margin-bottom: 30px;
  text-align: center;
  max-width: 760px;
  margin: 0 auto 30px auto;
}

.btn-primary {
  padding: 12px 20px;
  background-color: #bb86fc;
  color: #000;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
}
.btn-primary:hover { background-color: #9965f4; }

.btn-secondary {
  padding: 12px 20px;
  background-color: #555;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
}
.btn-secondary:hover { background-color: #777; }

.action-btn {
  color: #000;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-weight: bold;
  cursor: pointer;
}
.edit-btn { background-color: #03dac6; }
.edit-btn:hover { background-color: #018786; color: #fff; }
.delete-btn { background-color: #cf6679; }
.delete-btn:hover { background-color: #b33951; color: #fff; }

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
  position: relative;
}

.customer-card h3 { margin: 0 0 10px 0; color: #03dac6; font-size: 1.4rem; }
.customer-card h3 span { font-size: 1rem; color: #888; }
.customer-card p { margin: 5px 0; color: #b0b0b0; }

.status {
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

.card-actions {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}

/* Modal Form Styling */
.modal-overlay {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #1e1e1e;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 30px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.modal-content h2 {
  grid-column: 1 / -1;
  margin-top: 0;
  color: #03dac6;
  font-size: 1.5rem;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
}

.input-group { display: flex; flex-direction: column; }
.input-group.full-width { grid-column: 1 / -1; }
.input-group label { margin-bottom: 5px; font-size: 0.9rem; color: #b0b0b0; }
.input-group input, .input-group select {
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #444;
  background-color: #2c2c2c;
  color: #fff;
}

.modal-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
```

---

## Step 6: Mount `<app-p6-crud>` in Root App

1. In [`src/app/app.ts`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/app.ts), import `P6Crud` and add it to `imports: [...]`.
2. In [`src/app/app.html`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/app.html), add `<app-p6-crud></app-p6-crud>`.

Save and run `ng serve`. When you click "+ Add Customer", the modal opens with empty fields; when you click "Edit" on any customer card, the modal opens pre-filled with that customer's data! Saving updates the customer record in `CustomerService`, which simultaneously updates every component connected to the service.
