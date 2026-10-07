# Lesson 2: Services, Signals, and Control Flow

In our previous lesson, we learned how to enforce the shape of our data using **Interfaces**. However, if you look at the code we wrote, the data was hardcoded directly inside the component!

In Angular, there is a core principle called **Separation of Concerns**:
*   **Components** should only handle the user interface (button clicks, rendering HTML).
*   **Services** should handle the "business logic" (holding arrays, fetching JSON data, talking to APIs). 

In this lesson, we will create a Service to hold our customer data and introduce **Angular Signals**, the modern way to make data reactive.

---

## Step 1: Generate the Service

Open a new terminal window (keep your `ng serve` running in the first one) and use the CLI to generate a new service:

```bash
ng generate service services/customer
```

This creates a file called `src/app/services/customer.ts`. Open it up.

## Step 2: Build the Data Store (Using Signals)

Historically, passing data in Angular required complex libraries like `RxJS`. Modern Angular (v16+) uses **Signals**. Think of a Signal as a "smart wrapper" around a variable. When the data inside a Signal changes, Angular automatically repaints only the parts of the screen that need to update!

Update `customer.ts` to look like this:

```typescript
import { Injectable, signal } from '@angular/core';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root' // This ensures the whole app shares the exact same data!
})
export class CustomerService {
  
  // Wrap our array of mock data inside a signal()
  private customerData = signal<Customer[]>([
    {
      customerId: "CUST-001",
      firstName: "Alice",
      lastName: "Smith",
      email: "alice.smith@example.com",
      phone: "555-0101",
      address: "123 Maple St",
      city: "Springfield",
      state: "IL",
      zipCode: "62701",
      status: "Active"
    },
    {
      customerId: "CUST-002",
      firstName: "Bob",
      lastName: "Johnson",
      email: "bob.j@example.com",
      phone: "555-0102",
      address: "456 Oak Ave",
      city: "Metropolis",
      state: "NY",
      zipCode: "10001",
      status: "Inactive"
    }
  ]);

  // Expose the signal as read-only. 
  // Components can look at the data, but can't accidentally mutate it!
  customers = this.customerData.asReadonly();
}
```

## Step 3: Inject the Service into the Component

Now we need to connect our Component to our new Service using **Dependency Injection**. Modern Angular uses a simple `inject()` function to achieve this.

Open `src/app/test-customer/test-customer.ts` and replace its contents with:

```typescript
import { Component, inject } from '@angular/core';
import { CustomerService } from '../services/customer';

@Component({
  selector: 'app-test-customer',
  imports: [],
  templateUrl: './test-customer.html',
  styleUrl: './test-customer.css',
})
export class TestCustomer {
  // Use the inject() function to grab our service
  private customerService = inject(CustomerService);

  // Expose the read-only signal to our HTML template
  customerList = this.customerService.customers;
}
```

## Step 4: Iterate with Modern Control Flow (`@for`)

Finally, we need to loop through our array and render a card for each customer. Modern Angular (v17+) introduced the `@for` block, which makes looping over arrays incredibly clean and fast.

Open `src/app/test-customer/test-customer.html` and replace its contents with:

```html
<div class="header">
  <h2>Customer Directory</h2>
  <p>This data is flowing from the <strong>CustomerService</strong>!</p>
</div>

<!-- Notice the '()' on customerList() - this is how we read a Signal! -->
@for (customer of customerList(); track customer.customerId) {
  <div class="test-card">
    <h3>{{ customer.firstName }} {{ customer.lastName }}</h3>
    <hr>
    <p><strong>ID:</strong> {{ customer.customerId }}</p>
    <p>
      <strong>Status:</strong> 
      <!-- We dynamically assign CSS classes based on the status -->
      <span class="status-badge status-{{ customer.status.toLowerCase() }}">
        {{ customer.status }}
      </span>
    </p>
    <p><strong>Contact:</strong> {{ customer.email }}</p>
  </div>
} @empty {
  <div class="test-card">
    <p>No customers found.</p>
  </div>
}
```

*Note: The `@empty` block is a built-in fallback! If your array is ever completely empty, Angular will automatically display that block instead.*

## Step 5: Add Polish (CSS)

Let's make those dynamic status badges pop. Open `src/app/test-customer/test-customer.css` and paste this styling:

```css
.header { text-align: center; color: #fff; font-family: sans-serif; margin-bottom: 20px; }
.header h2 { color: #bb86fc; }
.test-card {
  background: #1e1e1e; color: #fff; padding: 20px; border-radius: 8px;
  max-width: 400px; font-family: sans-serif; margin: 15px auto;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}
h3 { color: #03dac6; margin-top: 0; }
p { color: #b0b0b0; }
hr { border-color: #333; }
.status-badge { padding: 2px 8px; border-radius: 4px; font-weight: bold; }
.status-active { background: #1b5e20; color: #a5d6a7; }
.status-inactive { background: #b71c1c; color: #ef9a9a; }
.status-pending { background: #f57f17; color: #fff59d; }
```

Save all your files. Check your browser at `http://localhost:4200` to see your fully separated, reactive, and dynamically styled application!
