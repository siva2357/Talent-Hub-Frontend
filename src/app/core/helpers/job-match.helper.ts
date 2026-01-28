export function getMatchBadge(matchLevel: string) {
  switch (matchLevel) {
    case 'great_match':
      return { label: 'Great Match', color: 'green' };
    case 'partial_match':
      return { label: 'Partial Match', color: 'orange' };
    default:
      return { label: 'Low Match', color: 'red' };
  }
}
