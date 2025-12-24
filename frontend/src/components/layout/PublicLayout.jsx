import Header from "./Header";
import Footer from "./Footer";

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <main className="flex-1">{children}</main>
      {/* <Footer /> */}
    </div>
  );
}

export default PublicLayout;
