import Header from '../components/Header';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    {children}
  </>
);

export default Layout;
