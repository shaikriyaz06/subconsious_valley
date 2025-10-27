import Navbar from "../components/Navbar";

export default function Sessions() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20 p-8">
        <h1 className="text-4xl font-bold mb-8">Sessions</h1>
        <div className="max-w-4xl">
          <p className="text-lg mb-6">Discover our transformative consciousness sessions designed to unlock your inner potential.</p>
          <p className="text-lg mb-6">Experience guided meditation sessions, brainwave entrainment, and altered state experiences.</p>
          <p className="text-lg mb-6">Choose from our variety of session types including Alpha, Theta, and Delta frequency programs.</p>
          <p className="text-lg">Join thousands of participants who have experienced profound personal growth and enhanced intuition.</p>
        </div>
      </div>
    </div>
  );
}