import Navbar from "../components/Navbar";

export default function Blog() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20 p-8">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <div className="max-w-4xl">
          <p className="text-lg mb-6">Explore our latest insights on consciousness, meditation, and personal transformation.</p>
          <p className="text-lg mb-6">Read articles on brainwave entrainment, altered states, and the science of consciousness.</p>
          <p className="text-lg mb-6">Discover tips, techniques, and success stories from our community of practitioners.</p>
          <p className="text-lg">Stay updated with the latest research and developments in consciousness studies.</p>
        </div>
      </div>
    </div>
  );
}
// import Blog from '@/pages/Blog.jsx';
// export default function Blog() {
//   return (
//     <div>
//       <Blog />
//     </div>
//   );
// }