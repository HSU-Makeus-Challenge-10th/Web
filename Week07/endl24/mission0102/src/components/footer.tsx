import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white p-6 mt-auto">
      <div className="container mx-auto text-center text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} Spinning LP. All rights reserved.
        </p>
        <div className={"flex justify-center space-x-4 mt-4"}>
          <Link to={"#"}>Privacy Policy</Link>
          <Link to={"#"}>Terms of Service</Link>
          <Link to={"#"}>Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
