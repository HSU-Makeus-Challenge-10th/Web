import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-6 mt-12">
      <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
        <p>&copy; {currentYear} 스피닝 돌림판 All Rights Reserved.</p>

        <div className="flex justify-center space-x-4 mt-4">
          <Link to="#" className="hover:text-gray-900 dark:hover:text-white">
            프라이버시 정책 (Privacy Policy)
          </Link>
          <Link to="#" className="hover:text-gray-900 dark:hover:text-white">
            서비스 약관 (Terms of Service)
          </Link>
          <Link to="#" className="hover:text-gray-900 dark:hover:text-white">
            연락처 (Contact)
          </Link>
        </div>
      </div>
    </footer>
  );
};
