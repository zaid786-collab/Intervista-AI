import Navbar from "../components/Navbar";
import Hero from "../components/hero";

function Home(navigation) {
  return (
    <>
      <Navbar {...navigation} />
      <Hero />
    </>
  );
}

export default Home;
