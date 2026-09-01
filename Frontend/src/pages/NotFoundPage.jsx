import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page narrow">
      <h2>Page not found</h2>
      <p className="muted">
        That page does not exist. <Link to="/">Back to search</Link>
      </p>
    </div>
  );
}
