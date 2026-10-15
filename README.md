# Emerald Bay Resorts - Smart Restaurant Billing & Revenue Analytics System

Built by **ORVA IT** | Laravel 11 + Inertia.js + React + Tailwind (single project, no separate API).

Implements the signed Requirements Document v1.0 (FR-01 to FR-30):
manual bill entry, auto/optional invoice numbers, auto date & time, configurable
service charge %, branded PDF invoices, SMS & WhatsApp delivery with retry queue,
menu categories, payment methods (Cash/Card), and the owner analytics dashboard.

---

## 1. Requirements

- PHP 8.2+ with extensions: mbstring, xml, curl, sqlite3 (or mysql), gd or imagick
- Composer 2
- Node.js 18+

## 2. Local setup

```bash
composer install
cp .env.example .env
php artisan key:generate

# SQLite quick start (default in .env.example)
touch database/database.sqlite

php artisan migrate --seed

npm install
npm run dev        # Vite dev server (keep running)
php artisan serve  # http://localhost:8000
```

Run the queue worker in another terminal (needed for SMS/WhatsApp sending):

```bash
php artisan queue:work --tries=3
```

### Seeded logins (change in production!)

| Role  | Email                  | Password |
|-------|------------------------|----------|
| Admin | admin@orvait.com       | password |
| Staff | cashier@emeraldbay.lk  | password |
| Owner | owner@emeraldbay.lk    | password |

## 3. Configuration

All in `.env`:

- `SMS_USER_ID`, `SMS_API_KEY`, `SMS_SENDER_ID` - notify.lk credentials
  (other gateways: adjust `app/Services/SmsService.php`, one method).
- `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` - Meta WhatsApp Cloud API.
- `WHATSAPP_TEMPLATE` - the approved **utility** template name. Business-initiated
  WhatsApp messages REQUIRE an approved template in production. Create one in
  Meta Business Manager with 3 body variables: {{1}} invoice no, {{2}} total,
  {{3}} link. Until approved, leave empty (plain text works only inside a
  24-hour customer service window).
- Service charge %, resort name/address/phone: **Settings page in the app** (admin login).

The SMS/WhatsApp message contains a **signed public link** to the PDF invoice
(`/i/{id}?signature=...`) - safe to share, cannot be guessed or enumerated.

## 4. Production deployment (Ubuntu VPS)

```bash
# after cloning / uploading and configuring .env with MySQL + APP_ENV=production
composer install --no-dev --optimize-autoloader
npm ci && npm run build
php artisan migrate --force --seed
php artisan config:cache && php artisan route:cache && php artisan view:cache
```

- Nginx -> PHP-FPM, document root = `public/`
- SSL: `certbot --nginx`
- Queue worker under Supervisor:

```ini
[program:emeraldbay-queue]
command=php /var/www/emeraldbay/artisan queue:work --tries=3 --sleep=3
autostart=true
autorestart=true
user=www-data
```

- Daily DB backup (NFR-03), e.g. cron:
  `0 2 * * * mysqldump emeraldbay | gzip > /backups/emeraldbay-$(date +\%F).sql.gz`

## 5. Project map

```
app/
  Http/Controllers/   Auth, Billing, Invoice, Send, Category, Setting, Dashboard
  Http/Middleware/    HandleInertiaRequests, EnsureRole (role:staff,admin,owner)
  Jobs/               SendInvoiceSms, SendInvoiceWhatsApp (queued, 3 retries)
  Models/             User, Invoice, InvoiceItem, Category, Setting, SentLog
  Services/           SmsService, WhatsAppService (swap providers here)
resources/
  js/Pages/           Auth, Billing, Invoices, Dashboard, Categories, Settings
  views/pdf/          invoice.blade.php (branded PDF template)
routes/web.php        all routes, role-protected
```

-- ORVA IT | hello@orvait.com | 071 451 6562
