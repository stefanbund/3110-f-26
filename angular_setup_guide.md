# Angular Development: Setup & Introduction to Interfaces

Welcome to modern Angular! In this tutorial, we will transition away from Vanilla JavaScript (where we managed the DOM directly) and set up a proper Angular development environment. We'll learn how to use the Angular CLI, scaffold a project, and introduce **Interfaces** to enforce strict data shapes.

---

## Part 1: Setting up the Development Environment

Modern Angular development relies on **Node.js** and the **Angular CLI** (Command Line Interface). The CLI automates the creation of files, components, and services.

### Step 1: Install the Angular CLI
First, ensure you have Node.js installed on your machine. Open your terminal and install the Angular CLI globally:

```bash
npm install -g @angular/cli
```

### Step 2: Scaffold a New Application
Once installed, we will use the CLI to create a new, blank application called `customer-app`. We will use CSS for our styles and skip adding routing for now to keep things simple.

```bash
ng new customer-app --style=css --routing=false
```
*(Note: Modern Angular (v14+) creates **Standalone Components** by default, meaning we no longer need to rely on complex `NgModule` configurations!)*

### Step 3: Run the Development Server
Navigate into your new project folder and start the local development server:

```bash
cd customer-app
ng serve
```
Your app is now running at **`http://localhost:4200`**.

---

## Part 2: Your First Interface and Component

In Vanilla JavaScript, data objects can take any shape, which often leads to hidden bugs. In Angular (which uses **TypeScript**), we use **Interfaces** to create strict rulebooks for our data.

### Step 1: Generate the Interface
Leave your `ng serve` running in one terminal, open a second terminal, and navigate to your `customer-app` folder. 

Use the CLI generator to scaffold an interface:

```bash
ng generate interface models/customer
```

Open `src/app/models/customer.ts` and define the shape of a Customer:

```typescript
export interface Customer {
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: 'Active' | 'Inactive' | 'Pending'; // Union type limits possible strings
}
```

### Step 2: Generate a Component
Next, let's create a visual component to test our new interface.

```bash
ng generate component test-customer
```

### Step 3: Enforce Strict Typing in the Component
Open `src/app/test-customer/test-customer.ts`. Import the interface and use it to strictly type a new variable:

```typescript
import { Component } from '@angular/core';
import { Customer } from '../models/customer';

@Component({
  selector: 'app-test-customer',
  imports: [],
  templateUrl: './test-customer.html',
  styleUrl: './test-customer.css',
})
export class TestCustomer {
  // Teaching Moment: If you misspell a property here, TypeScript will throw an error instantly!
  testCustomer: Customer = {
    customerId: 'CUST-999',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    phone: '555-0000',
    address: '100 Main St',
    city: 'Techville',
    state: 'CA',
    zipCode: '90000',
    status: 'Active'
  };
}
```

### Step 4: Display the Data in the Template
Open `src/app/test-customer/test-customer.html` and use Angular's `{{ }}` interpolation syntax to display the data safely:

```html
<div class="test-card">
  <h2>Interface Test Component</h2>
  <hr>
  <h3>{{ testCustomer.firstName }} {{ testCustomer.lastName }}</h3>
  <p><strong>ID:</strong> {{ testCustomer.customerId }}</p>
  <p><strong>Status:</strong> {{ testCustomer.status }}</p>
</div>
```

### Step 5: Render the Component in the App Root
Finally, we need to tell Angular to display our test component on the main screen. 

Open `src/app/app.ts`, import `TestCustomer`, and add it to the `imports` array:
```typescript
import { Component } from '@angular/core';
import { TestCustomer } from './test-customer/test-customer';

@Component({
  selector: 'app-root',
  imports: [TestCustomer], // Make sure it's imported here!
  templateUrl: './app.html',
})
export class App {}
```

Then, clear everything out of `src/app/app.html` and simply add your component selector:
```html
<app-test-customer></app-test-customer>
```

Navigate back to **`http://localhost:4200`** in your browser, and you should see your strictly-typed test component successfully rendering!
