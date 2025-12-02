## Everwear Backend (Simple Guide)

This is a very simple backend for the Everwear clothing website.  
It uses **Node.js**, **Express**, and **MongoDB Atlas** to save data.

Backend folder is this:

```text
Everwear/backend
```

Here you can find the server file, routes and models.

---

### 1. Things you need before

- Node.js installed (version 18 or higher is good)
- npm (comes with Node)
- A MongoDB Atlas account (free cluster is ok)
- Git (only if you want to pull from GitHub)

---

### 2. Install backend packages

Open terminal and go to backend folder:

```bash
cd Everwear/backend
npm install
```

This will install packages like:

- express
- mongoose
- bcryptjs
- cors
- dotenv
- jsonwebtoken

You only have to do this one time on a new machine.

---

### 3. Make MongoDB Atlas database

1. Go to MongoDB Atlas website and login.
2. Create a **project** and then create a **free shared cluster**.
3. Create a **database user**:
   - Go to **Database Access** → **Add New Database User**  
   - Choose a username (for example: `everwear_user`)  
   - Choose a password and remember it
   - Give role like `atlasAdmin` or `readWriteAnyDatabase` (for testing)
4. Allow your IP:
   - Go to **Network Access** → **Add IP Address**  
   - You can use `0.0.0.0/0` for testing (allows all IPs)
5. Get the connection string:
   - Go to **Database** → click **Connect** → **Connect your application**  
   - Copy the string that looks like this:

<!-- Example connection string (not real credentials):
mongodb+srv://username:password@cluster0.example.mongodb.net/database?retryWrites=true&w=majority
-->

Make sure at the end you have `/everwear` as database name.

---

### 4. Make `.env` file (very important)

In the `Everwear/backend` folder create a file called `.env`.

Example `.env` file:

```text
MONGODB_URI=""
PORT=8080
JWT_SECRET=some-secret-key-here
FRONTEND_URL=http://localhost:5173
```

Do **not** put spaces in the connection string.

---

### 5. Seed some products (optional but nice)

There is a small script to put sample products into the database.

In `Everwear/backend` run:

```bash
node scripts/seedProducts.js
```

If everything is correct you should see:

```text
Trying to connect to MongoDB...
Connected to MongoDB!
Cleared existing products
Products seeded successfully!
```

Then in MongoDB Atlas you will see a `products` collection with items.

---

### 6. Start the backend server

In the backend folder run:

```bash
npm start
```

or for auto reload when you change files:

```bash
npm run dev
```

If it works you will see something like:

```text
Trying to connect to MongoDB...
Connected to MongoDB!
Server started on port 8080
API is at http://localhost:8080/api
```

You can test in browser:

- `http://localhost:8080/` → should show `{ "message": "Backend is working!" }`
- `http://localhost:8080/api` → should show list of API paths

---

### 7. Run the frontend with backend

Frontend lives in main folder `Everwear`.

In another terminal:

```bash
cd Everwear
npm install    
npm run dev
```

Then open this in browser:

```text
http://localhost:5173/
```

Now frontend will talk to backend on `http://localhost:8080/api`.

---

### 8. What data is saved in MongoDB

The backend saves these things in the database:

- **Users**
  - name, email, hashed password, address, order history
- **Products**
  - product name, price, sizes, colors, images, stock count
- **ShoppingCart**
  - userId, list of items, quantity, subtotal, shippingFee, totalPrice
- **Orders**
  - userId, products in order, total, status (pending / shipped / delivered)
- **ChatbotInquiry**
  - userId (optional), userMessage, botResponse, time

Shipping rule in cart:
- if subtotal < 100 → shippingFee = 10
- if subtotal >= 100 → shippingFee = 0 (free)

---

### 9. Common errors and simple fixes

**1. `ERROR: Need MongoDB connection string!`**
- Check `.env` file exists in `backend` folder
- Check variable name is exactly `MONGODB_URI`

**2. `Could not connect to MongoDB: bad auth / authentication failed`**
- Username or password is wrong
- Try to reset the user password in MongoDB Atlas
- Put the new password in `.env` and restart server

**3. CORS or network error from frontend**
- Make sure backend is running on port `8080`
- Check `FRONTEND_URL` in `.env` is `http://localhost:5173`

**4. Nothing in products collection**
- Run `node scripts/seedProducts.js` again

---

### 10. Short summary for friends

1. Clone repo and go to `Everwear/backend`
2. Run `npm install`
3. Create MongoDB Atlas cluster and user
4. Put connection string and other values in `.env`
5. (Optional) run `node scripts/seedProducts.js` to add demo products
6. Run backend with `npm start`  
7. In another terminal, go to `Everwear` and run `npm run dev`
8. Open `http://localhost:5173` and test the site

That’s all. This guide is simple on purpose so new students can follow it easily.


