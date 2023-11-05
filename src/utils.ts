export function getPageId(urlstring: string): string {
  const url = new URL(urlstring);
  const pathSegments = url.pathname.split('-');
  const pageId = pathSegments[pathSegments.length - 1];

  console.log(`pageId: ${pageId}`);

  return pageId;
}