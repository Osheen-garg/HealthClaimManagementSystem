import Navbar from "../Components/Navbar";

function PatientLayout({ children }) {
  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto p-8">
        {children}
      </main>
    </>
  );
}

export default PatientLayout;