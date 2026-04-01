import { Link } from "../router";

const Header = () => {
  return (
    <nav style={{ display: "flex", gap: "10px" }}>
      <Link to="/matthew">MATTHEW</Link>
      <Link to="/aeong">AEONG</Link>
      <Link to="/joy">JOY</Link>
      <Link to="/not-found">NOT FOUND</Link>
    </nav>
  );
};

export default Header;
