# Google Search Console Setup for ajmalinvestment.com

## Step 1: Add Property to Google Search Console

1. Go to: https://search.google.com/search-console
2. Click "Add Property" → Select "Domain" (recommended for full coverage)
3. Enter: `ajmalinvestment.com`

## Step 2: DNS Verification (Namecheap)

**Copy-Paste DNS Record for Namecheap:**
```
Type: TXT
Host: @
Value: google-site-verification=SAMPLE-ABC123XYZ789-VERIFICATION-CODE
TTL: Automatic
```

**⚠️ Important:** Replace the sample verification code above with your actual code from Google Search Console.

**Namecheap Configuration Steps:**
1. Login to Namecheap → Domain List → Manage `ajmalinvestment.com`
2. Advanced DNS → Add New Record
3. Select "TXT Record" from dropdown
4. Host: `@` (represents the root domain)
5. Value: Paste your verification code from GSC
6. TTL: Leave as "Automatic"
7. Save changes (DNS propagation: 5-10 minutes)
8. Return to Google Search Console and click "Verify"

## Step 3: Submit Sitemap

After verification is complete:
1. In Google Search Console → Sitemaps
2. Add new sitemap: `https://ajmalinvestment.com/sitemap.xml`
3. Click "Submit"

## Step 4: Request URL Indexing

Use the URL Inspection tool to request indexing for these priority pages:
- `https://ajmalinvestment.com/`
- `https://ajmalinvestment.com/register`
- `https://ajmalinvestment.com/investments`
- `https://ajmalinvestment.com/dashboard`

## Step 5: Monitor Index Status

Check these reports weekly:
- Index Coverage
- Search Performance
- Core Web Vitals
- Mobile Usability

## Expected Timeline

- **0-24 hours**: Verification complete, sitemap submitted
- **1-7 days**: Initial page indexing begins
- **1-4 weeks**: Full site indexing and branded search visibility
- **1-3 months**: Improved rankings for "Ajmal Investments PLC"
