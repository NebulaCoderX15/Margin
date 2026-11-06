import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpenText } from 'lucide-react';

export default function NotFoundPage() {
  return <section className="not-found content-wrap mx-auto flex min-h-[60vh] w-[min(1160px,calc(100%-56px))] flex-col items-start justify-center py-16"><div className="not-found-mark"><BookOpenText size={28} /></div><div className="section-eyebrow">A PAGE LEFT UNWRITTEN</div><h1>This page is off<br />the <em>margin.</em></h1><p>The link might be old, or this page may have moved on. Let’s get you back to something good.</p><Link to="/" className="button button-dark button-large"><ArrowLeft size={16} /> Back to the reading room</Link></section>;
}
