import "./styles.css";

export default function Home() {
  
  return <div style={{ height: "100vh" }} id="nexus-root">
    <div id="center">
      <h2 className="fade1">Welcome to</h2>
      <h1 className="fade1">Nexus</h1>
      <div className="nexus fade1" style={{ marginTop: "2em" }}></div>

      <button id="get-started-button"
        className="fade3"
        style={{ marginTop: "2em" }}
      >
        Get Started
      </button>
    </div>

  </div>
}
