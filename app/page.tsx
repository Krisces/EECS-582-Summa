import Header from "./_components/Header";  // Importing the Header component from the '_components' folder
import Hero from "./_components/Hero";  // Importing the Hero component from the '_components' folder

// Home component, typically the landing page of the website
export default function Home() {
  return (
    <div>
      <title>Welcome to Summa</title>  {/* Setting the page title for the browser tab */}
      <Header/>  {/* Rendering the Header component */}
      <Hero/>  {/* Rendering the Hero component */}
    </div>
  );
}
