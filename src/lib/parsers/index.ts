import { parseAmazonEmail, ParseResult } from './amazon';
import { parseFlipkartEmail } from './flipkart';
import { parseMeeshoEmail } from './meesho';
import { parseShopifyEmail } from './shopify';
import { parseWooCommerceEmail } from './woocommerce';
import { parseMyntraEmail, parseAjioEmail } from './myntra';
import { runAIAssistedExtractor } from './aiExtractor';

export { type ParseResult } from './amazon';

export interface EmailPayload {
  id?: string;
  subject: string;
  from: string;
  body: string;
  date?: string;
}

export function parseOrderEmail(email: EmailPayload): ParseResult {
  const { subject = '', from = '', body = '' } = email;

  // 1. Amazon
  const amazonResult = parseAmazonEmail(subject, body, from);
  if (amazonResult) return amazonResult;

  // 2. Flipkart
  const flipkartResult = parseFlipkartEmail(subject, body, from);
  if (flipkartResult) return flipkartResult;

  // 3. Meesho
  const meeshoResult = parseMeeshoEmail(subject, body, from);
  if (meeshoResult) return meeshoResult;

  // 4. Shopify
  const shopifyResult = parseShopifyEmail(subject, body, from);
  if (shopifyResult) return shopifyResult;

  // 5. WooCommerce
  const wooResult = parseWooCommerceEmail(subject, body, from);
  if (wooResult) return wooResult;

  // 6. Myntra
  const myntraResult = parseMyntraEmail(subject, body, from);
  if (myntraResult) return myntraResult;

  // 7. Ajio
  const ajioResult = parseAjioEmail(subject, body, from);
  if (ajioResult) return ajioResult;

  // 8. Fallback to AI-assisted heuristic entity extraction
  return runAIAssistedExtractor(subject, body, from);
}
