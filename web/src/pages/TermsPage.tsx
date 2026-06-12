const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-sans flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-[#121212] px-8 py-12 text-center relative overflow-hidden">
          <h1 className="text-3xl font-serif tracking-wide text-white relative z-10">
            Terms of <span className="text-[#3A7D64] italic">Service</span>
          </h1>
          <p className="text-gray-400 text-sm mt-3 relative z-10">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content Section */}
        <div className="px-8 py-10 sm:px-12 text-gray-700 space-y-8 leading-relaxed text-sm sm:text-base">
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3 font-serif">
              1. Introduction
            </h2>
            <p>
              Welcome to Folio. It is designed as a social space for readers to
              connect, share insights, and discuss books. By registering an
              account and using Folio, you agree to these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3 font-serif">
              2. Age Requirements
            </h2>
            <p>
              You must be at least <strong>12 years of age</strong> to create an
              account and use this platform. By signing up, you confirm that you
              meet this age requirement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3 font-serif">
              3. User Conduct & Content
            </h2>
            <p className="mb-3">
              Folio is a space for thoughtful discussion. When posting reviews,
              quotes, or interacting with other readers, you agree to abide by
              the following rules:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>
                Do not post content that violates or infringes on the rights of
                others, including intellectual property or privacy rights.
              </li>
              <li>
                Do not post abusive, harassing, or discriminatory content.
              </li>
              <li>
                Ensure any extended book excerpts fall under fair use
                guidelines.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3 font-serif">
              4. Moderation & Account Termination
            </h2>
            <p>
              We want to maintain a high-quality, respectful environment for all
              readers. Therefore,{" "}
              <strong>
                we reserve the right to remove any content or terminate user
                accounts
              </strong>{" "}
              at any time, for any reason, without prior notice, especially if
              these terms are violated.
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

export default TermsPage;
