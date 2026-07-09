const Footer = () => {
  return (
    <footer className="bg-white border-t mt-8 py-5">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">

        <div>
          <h3 className="font-semibold text-gray-800">
            Health Claim Management System
          </h3>

          <p className="text-gray-500">
            MCA Major Project • MERN Stack
          </p>
        </div>

        <div className="mt-3 md:mt-0 text-center md:text-right">
          <p>
            © {new Date().getFullYear()} All Rights Reserved
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Developed by Osheen Garg
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;