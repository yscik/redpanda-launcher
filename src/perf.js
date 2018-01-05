export class perf
{
  static start()
  {
    performance.mark('p-start');
  }

  static log(...args)
  {
    performance.mark('p-end');
    performance.measure('p', 'p-start', 'p-end');
    const m = performance.getEntriesByName('p')[0];
    console.log(...args, m.duration);
    performance.clearMarks();
    performance.clearMeasures();
  }
}