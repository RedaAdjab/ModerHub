export default function Loader({ label = "Loading..." }) {
  return (
    <div className="loader-wrap" role="status" aria-live="polite">
      <div className="loader-dot" />
      <p>{label}</p>
    </div>
  );
}
