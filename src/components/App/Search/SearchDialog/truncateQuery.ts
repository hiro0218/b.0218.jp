const MAX_QUERY_DISPLAY_LENGTH = 20;

export function truncateQuery(query: string): string {
  if (query.length <= MAX_QUERY_DISPLAY_LENGTH) {
    return query;
  }

  return `${query.slice(0, MAX_QUERY_DISPLAY_LENGTH)}...`;
}
