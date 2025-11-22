// services/db/queries.ts
import { queryDB } from "./db";

// ---------------- USERS ----------------
export async function createUser(user: any) {
  return await queryDB(
    `INSERT INTO users (id, name, email, password, role, created_at)
     VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [user.id, user.name, user.email, user.password, user.role]
  );
}

export async function getUserByEmail(email: string) {
  return await queryDB(`SELECT * FROM users WHERE email = ?`, [email]);
}

// ---------------- BLOG ----------------
export async function createBlogPost(post: any) {
  return await queryDB(
    `INSERT INTO blogs (id, title, content, image_url, author, active, created_at)
     VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [
      post.id,
      post.title,
      post.content,
      post.image_url,
      post.author,
      post.active ?? 1,
    ]
  );
}

export async function listBlogPosts() {
  return await queryDB(`SELECT * FROM blogs ORDER BY created_at DESC`);
}

// ---------------- ADS ----------------
export async function createAd(ad: any) {
  return await queryDB(
    `INSERT INTO ads (id, title, description, price, images, user_id, active, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [
      ad.id,
      ad.title,
      ad.description,
      ad.price,
      JSON.stringify(ad.images || []),
      ad.user_id,
      ad.active ?? 1,
    ]
  );
}

export async function listAds() {
  return await queryDB(`SELECT * FROM ads WHERE active = 1 ORDER BY created_at DESC`);
}

// ---------------- BANNERS ----------------
export async function listBanners() {
  return await queryDB(`SELECT * FROM banners WHERE active = 1 ORDER BY priority DESC`);
}

// ---------------- SETTINGS ----------------
export async function getSettings() {
  return await queryDB(`SELECT * FROM settings LIMIT 1`);
}

