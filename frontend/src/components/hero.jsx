import "./Hero.css";

function Hero() {
  return (
    <section className="hero">

      <div className="left">

        <div className="badge">
          🟢 Live now — real-time voice interviews
        </div>

        <h1>
          Walk into your
          <br />
          next interview
          <br />
          <span>already having won it.</span>
        </h1>

        <p>
          Intervista AI runs realistic AI mock interviews that listen,
          challenge your answers and provide instant feedback to help you
          crack your dream job.
        </p>

        <div className="buttons">

          <button className="primary">
            🎤 Start Interview
          </button>

          <button className="secondary">
            ▶ Watch Demo
          </button>

        </div>

      </div>

      <div className="right">

        <div className="voiceCircle">

          <div className="innerCircle">

            <div className="bars">

              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;