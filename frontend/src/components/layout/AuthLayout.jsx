import Brand from "../ui/Brand";

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* LEFT: Branding / Visual */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-blue-900 text-white px-12">
        <Brand size="lg" showText={true} />
        <p className="mt-6 text-center text-blue-100 text-lg leading-relaxed">
          Institution Management System<br />
          R V College of Engineering
        </p>
      </div>

      {/* RIGHT: Login Form */}
      <div className="flex items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-xl bg-white p-10 rounded-2xl shadow-md border">
          
          {/* Logo for mobile */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Brand size="lg" showText={false} />
          </div>

          {children}
        </div>
      </div>

    </div>
  );
}

export default AuthLayout;
