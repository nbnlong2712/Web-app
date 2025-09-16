# 5) Data Import & Admin
- **CSV fields:** name, slug, description, homepage_url, affiliate_url, primary_tag, tags (`images;image-generator`), pricing, platform, language (`vi;en`), no_signup, last_updated.
- **Admin Import:** `/admin/import` form → server action parses → upsert into `tools`.
- **Validation:** require `name`, `slug`, `homepage_url`, at least one `primary_tag`.
