# 🧱 Bitcoin Block Explorer API

An open-source, developer-friendly REST API built with **Node.js** and **Express** to explore Bitcoin blockchain data like blocks and chain status.  
It uses a **pruned Bitcoin Core node** and exposes clean, well-documented endpoints using **Swagger UI** with dynamic route annotations.

> 📘 **API Docs:** [https://api.btctrace.ai/docs](https://api.btctrace.ai/docs)

---

## 🚀 Features

- ✅ Explore the **latest Bitcoin blocks**
- 🔍 Fetch block data by **hash** or **height**
- 🧭 Get **chain tip info**, peer status, and network stats
- 📜 Interactive **Swagger UI documentation**
- 🧩 Modular and extensible **Express.js architecture**
- ⚡ Uses **snake_case** for all responses and **camelCase** for all inputs

---

## ⚙️ Self-Hosting with Your Own Bitcoin Node

You can clone this repository and connect it to your own **Bitcoin Core node**, whether pruned or full, by setting the following environment variables in a `.env` file:

```env
SELF_HOSTED_BTC_HOST=127.0.0.1
SELF_HOSTED_BTC_USERNAME=bitcoinrpc
SELF_HOSTED_BTC_PASSWORD=your_secure_password
```

This allows full control over the backend RPC node and can be used in air-gapped or private environments.

---

## ⚠️ Limitations

- The backend uses a **pruned Bitcoin node**, so only **recent block data** is available.
- Older blocks or full transaction history may not be retrievable due to pruning.

---

## 📘 Field Naming Conventions

- All **JSON responses** use `snake_case`
- All **JSON responses, request parameters, query strings, and request bodies** use `camelCase`

---

## 🤝 Contributing

We welcome contributions from the open-source community! If you'd like to improve or extend this API:

1. **Fork** the repository
2. **Create a new branch** for your feature or fix
3. **Commit** your changes
4. **Open a Pull Request**

> ✅ All contributions are welcome — bug fixes, performance improvements, new endpoints, or documentation!

---

## 🚀 Deployment

- This project uses a CI pipeline that **auto-deploys the `main` branch to production**
- Any push to the `main` branch will **immediately update the live server**

> 🔒 Please ensure Pull Requests are properly reviewed and tested.

---

✅ Ideal for light clients, dashboards, explorers, and blockchain status monitors.
