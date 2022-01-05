import { QuoteHeader } from '../store';

export default function selectQuoteByQuoteNum(
  quotes: Array<QuoteHeader>,
  which: string,
): QuoteHeader | undefined {
  return quotes.find((item) => item.quote_number === which);
}
