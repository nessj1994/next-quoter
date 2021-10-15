// @Refactor: Move this to a new location in some type of quoter-util-functions?
export function checkQuotesLoaded(
  requireSelected: boolean,
  quotes?: Array<any>,
  selectedItem?: any | undefined | null,
  queryParams?: URLSearchParams | undefined | null,
): boolean {
  // This function returns true if quotes array is empty or false if quotes are already loaded
  // console.log(quotes);
  // console.log(selectedItem);
  // console.log(queryParams);
  if (quotes && quotes.length === 0) {
    return false;
  } else if (
    requireSelected &&
    (selectedItem === null || selectedItem === undefined)
  ) {
    return false;
  } else if (
    requireSelected &&
    selectedItem!.QuoteNumber !== queryParams!.get('quoteNum')
  ) {
    return false;
  }

  // console.log('returning true');
  return true;
}
