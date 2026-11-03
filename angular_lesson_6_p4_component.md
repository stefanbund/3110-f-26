# Lesson 6: Transforming Project 4 (`p4`) into an Angular Component (`P4Delete`)

In Project 4 (`p4/app4.html` and `p4/app4.js`), we added a **Delete** button to each customer card. In Vanilla JS, deleting a record required:
1. Maintaining a manual loop counter (`let currentIndex = 0;` and `currentIndex++`) inside `renderCustomers()`.
2. String-interpolating `onclick="deleteCustomer(${currentIndex})"` into `cardDiv.innerHTML`.
3. Mutating the array in place via `customers.splice(indexToRemove, 1)` and calling `renderCustomers()` to wipe `container.innerHTML = ''` and rebuild the entire DOM list.

In this lesson, we transform `p4` into the **`P4Delete`** Angular component (`<app-p4-delete>`), introducing `@for`'s built-in **`$index`** contextual variable and adding `deleteCustomer()` to [`CustomerService`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/services/customer.ts).

---

## Key Teaching Concept: Manual Loop Counters & `splice()` vs. `$index` & Signal Updates

| Task | In `p4/app4.js` (Vanilla JS) | In `P4Delete` & `CustomerService` (Angular) |
| :--- | :--- | :--- |
| **Track Item Index** | `let currentIndex = 0;` ... `currentIndex++;` | Automatic **`$index`** inside `@for` block |
| **Bind Delete Button** | `onclick="deleteCustomer(${currentIndex})"` | `(click)="deleteCustomer($index)"` |
| **Remove Item from State** | `customers.splice(indexToRemove, 1)` | `this.customerData.update(list => list.filter((_, i) => i !== indexToRemove))` |
| **Update the DOM** | `container.innerHTML = ''` + rebuild all cards | **Surgical DOM update:** Angular removes only the deleted card across all components |

---

## Step 1: Add `deleteCustomer()` to `CustomerService`

First, open [`src/app/services/customer.ts`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/services/customer.ts) and add the `deleteCustomer(indexToRemove: number)` method. With Angular Signals, we use `.update()` and `.filter()` to return a new array without the removed index, which triggers all listening components to update immediately:

```typescript
  // DELETE (Introduced in P4)
  // Replaces customers.splice(indexToRemove, 1) + renderCustomers() from p4/app4.js
  deleteCustomer(indexToRemove: number): void {
    this.customerData.update(currentList =>
      currentList.filter((_, index) => index !== indexToRemove)
    );
  }
```

---

## Step 2: Generate the `p4-delete` Component

Inside your `customer-app` folder, run:

```bash
ng generate component p4-delete
```

---

## Step 3: Implement `P4Delete` Component Logic

Open [`src/app/p4-delete/p4-delete.ts`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/p4-delete/p4-delete.ts) and connect both `addCustomer()` and `deleteCustomer(indexToRemove: number)` to `CustomerService`:

```typescript
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Customer } from '../models/customer';
import { CustomerService } from '../services/customer';

@Component({
  selector: 'app-p4-delete',
  imports: [FormsModule],
  templateUrl: './p4-delete.html',
  styleUrl: './p4-delete.css',
})
export class P4Delete {
  private customerService = inject(CustomerService);
  customers = this.customerService.customers;

  newCustomer: Customer = this.createEmptyCustomer();

  addCustomer(): void {
    this.customerService.addCustomer({ ...this.newCustomer });
    this.newCustomer = this.createEmptyCustomer();
  }

  // Delegates deletion to the shared CustomerService
  deleteCustomer(indexToRemove: number): void {
    this.customerService.deleteCustomer(indexToRemove);
    console.log(
      'Customer deleted at index ' +
        indexToRemove +
        '! Total array length is now: ' +
        this.customers().length
    );
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

---

## Step 4: Use `$index` in the Component Template

In [`src/app/p4-delete/p4-delete.html`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/p4-delete/p4-delete.html), Angular's `@for` loop automatically exposes `$index` for each row. We pass `$index` directly into `(click)="deleteCustomer($index)"`:

```html
  <div id="customer-container">
    @for (customer of customers(); track customer.customerId) {
      <div class="customer-card">
        <h3>
          {{ customer.firstName }} {{ customer.lastName }}
          <span>(#{{ customer.customerId }})</span>
        </h3>
        <button class="delete-btn" (click)="deleteCustomer($index)">Delete</button>
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
        <p>No customers remaining in the directory.</p>
      </div>
    }
  </div>
```

---

## Step 5: Copy Scoped Styles & Mount `<app-p4-delete>`

1. Copy the styles (including `.customer-card { position: relative; }` and `.delete-btn { position: absolute; top: 20px; right: 20px; ... }`) from `p4/app4.html` into [`src/app/p4-delete/p4-delete.css`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/p4-delete/p4-delete.css).
2. Import `P4Delete` in [`src/app/app.ts`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/app.ts) and render `<app-p4-delete></app-p4-delete>` in [`src/app/app.html`](file:///Users/stefanbund/Desktop/3110/3100-F-26/customer-app/src/app/app.html).
