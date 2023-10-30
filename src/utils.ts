
export function getPageId() {
  const pageId = process.argv[2];
  if (!pageId) {
    console.error('Please provide a pageId')
    process.exit(1)
  }
  return pageId;
}