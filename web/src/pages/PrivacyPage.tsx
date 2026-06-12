const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-sans flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-[#121212] px-8 py-12 text-center relative overflow-hidden">
          <h1 className="text-3xl font-serif tracking-wide text-white relative z-10">
            Privacy <span className="text-[#3A7D64] italic">Policy</span>
          </h1>
          <p className="text-gray-400 text-sm mt-3 relative z-10">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content Section */}
        <div className="px-8 py-10 sm:px-12 text-gray-700 space-y-8 leading-relaxed text-sm sm:text-base">
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3 font-serif">
              1. Information We Collect
            </h2>
            <p>
              When you create an account on Folio to start your reading journey,
              we collect basic information to identify you on the platform.
              Specifically, we collect your <strong>Name</strong> and{" "}
              <strong>Email Address</strong> at registration. We may also
              collect your chosen username and profile picture.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3 font-serif">
              2. How We Use Your Data
            </h2>
            <p>
              The information we collect is used solely to provide and improve
              the Folio experience. It allows you to log in, maintain your
              digital library, and interact with the community.
            </p>
            <div className="bg-[#FBF9F6] border-l-4 border-[#3A7D64] p-4 mt-4 text-gray-800">
              <strong>Our Promise:</strong> We respect your privacy. We do not,
              and will never, sell your personal data to third parties.
            </div>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3 font-serif">
              3. Data Security
            </h2>
            <p>
              Your data is stored securely. While no digital platform is
              completely immune to risks, we implement standard security
              measures to protect your personal information and reading data
              from unauthorized access or disclosure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3 font-serif">
              4. Your Rights & Account Deletion
            </h2>
            <p>
              You own your reading data. If you wish to leave the platform and
              have your information permanently removed from our databases, you
              can delete your account at any time.
            </p>
          </section>

          {/* Footer Action */}
          <div className="pt-8 mt-8 border-t border-gray-100 text-center">
            <a
              href="/register"
              className="text-[#3A7D64] font-medium hover:underline inline-flex items-center gap-2"
            >
              <svg
                className="w-4 h-4 rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
              Return to Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
