const Header = () => (
  <div className="card flex items-center justify-between">
    <div>
      <p className="text-xs tracking-[0.25em] uppercase text-sky-400">
        Visitor Management
      </p>
      <h1 className="text-2xl md:text-3xl font-semibold text-white mt-1">
        Front Desk Check-in Tab
      </h1>
    </div>
    <div className="hidden sm:flex items-center gap-2 text-emerald-300 text-xs">
      <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
      Live Mode
    </div>
  </div>
);
export default Header;
