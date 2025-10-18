import Header from "@/components/Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="cointainer py-10">{children}</div>
    </main>
  );
};

export default Layout;
