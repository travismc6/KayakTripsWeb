export function YearChart({ data }: { data: { year: number; miles: number; trips: number }[] }) {
  const visible = data.slice(-8);
  const max = Math.max(...visible.map(x => x.miles), 1);
  return <div className="year-chart">
    <div className="chart-y"><span>{Math.ceil(max)}</span><span>{Math.ceil(max / 2)}</span><span>0</span></div>
    <div className="chart-bars">{visible.map(item => <div className="chart-col" key={item.year} title={`${item.trips} trips · ${item.miles.toFixed(1)} miles`}><span>{item.miles.toFixed(0)}</span><div className="chart-track"><i style={{ height: `${Math.max(5, item.miles / max * 100)}%` }} /></div><small>{item.year}</small></div>)}</div>
  </div>;
}
