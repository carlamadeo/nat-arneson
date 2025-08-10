
export function formatDate(d: Date, opts?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(undefined, opts).format(d)
}
export function startOfMonth(d: Date) { const x = new Date(d); x.setDate(1); x.setHours(0,0,0,0); return x }
export function addMonths(d: Date, count: number) { const x = new Date(d); x.setMonth(x.getMonth()+count); return x }
export function daysInMonth(year: number, monthIndex: number) { return new Date(year, monthIndex+1, 0).getDate() }
export function toHM(d: Date) { return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}` }
export function parseHM(hm: string) { const [h,m]=hm.split(':').map(Number); return {h, m} }
export function setHM(d: Date, hm: string) { const {h,m}=parseHM(hm); const x=new Date(d); x.setHours(h,m,0,0); return x }
export function isSameDay(a: Date, b: Date) { return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate() }
export function addMinutes(d: Date, mins: number) { return new Date(d.getTime() + mins*60*1000) }
export function inFuture(d: Date) { return d.getTime() > Date.now() }
export function weekdayShort() { const s=new Intl.DateTimeFormat(undefined,{weekday:'short'}).formatToParts(new Date()).find(p=>p.type==='weekday')?.value??''; return s.length===1?["S","M","T","W","T","F","S"]:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"] }
