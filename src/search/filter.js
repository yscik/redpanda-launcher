export function filter(term, collection)
{
  const terms = term.split(' ');

  return (collection||[]).filter(s => containsTerms(s.title) || containsTerms(s.url));

  function containsTerms(value)
  {
    if(!value) return false;
    value = value.toLowerCase();
    return terms.every(term => value.includes(term))
  }
}