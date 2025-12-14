export default function Loading() {
  return (
    <div className="loading-screen" aria-busy="true" aria-live="polite">
      <div className="loader-wrap">
        <div className="loader-ring"></div>
        <img src="/load.png" alt="loading" className="loader-image" />
      </div>
    </div>
  );
}
