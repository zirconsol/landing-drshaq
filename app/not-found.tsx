import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section" style={{ paddingTop: "88px" }}>
      <div className="container">
        <h1 className="section-title">No encontramos esa página</h1>
        <p className="section-copy">
          Volvé al inicio para seguir explorando los drops disponibles.
        </p>
        <div style={{ marginTop: "24px" }}>
          <Link className="button-primary" href="/">
            Ir al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
