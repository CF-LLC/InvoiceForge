# Universal Invoice Generator

This app generates professional invoices and exports them as an image.

## What Changed

- Removed hardcoded company details from the invoice preview.
- Added business profile fields directly in the form:
	- Business name
	- Business email
	- Business address
- Added configurable `currencyCode` per invoice (for example: `USD`, `EUR`, `GBP`).
- Added PDF export action (opens print dialog, then save as PDF).
- Added reusable local templates (save/load business profile in browser storage).
- Centralized app defaults and metadata in `lib/invoice-config.ts`.

## Customize For Your Use Case

Edit `lib/invoice-config.ts` to change global defaults:

- `appName`
- `appTagline`
- `description`
- `defaults.senderName`
- `defaults.senderEmail`
- `defaults.senderAddress`
- `defaults.currencyCode`
- `defaults.locale`
- `defaults.taxRate`

## Reusable Templates

In the form, use:

- `Save Template` to store your business profile locally
- `Load Template` to apply it to a new invoice
- `Clear Template` to remove the saved local template

Templates are stored per browser using local storage.


## Export Options

- `Save as Image` downloads a PNG file
- `Export PDF` opens the print dialog so you can save as PDF

## Development

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.
