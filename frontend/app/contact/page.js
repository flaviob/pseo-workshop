const config = require("../../config");

export const metadata = {
  title: "Contact Us",
  description: `Get in touch with ${config.siteName}`,
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        Have a question, suggestion, or want to report an issue? We&apos;d love to
        hear from you.
      </p>

      <form
        action={`https://formspree.io/f/YOUR_FORM_ID`}
        method="POST"
        className="space-y-6"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
          />
        </div>

        <button
          type="submit"
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
        >
          Send Message
        </button>
      </form>

      <p className="text-sm text-gray-400 mt-6">
        Replace <code>YOUR_FORM_ID</code> in the source code with your{" "}
        <a
          href="https://formspree.io"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Formspree
        </a>{" "}
        form ID, or wire up your own form handler.
      </p>
    </div>
  );
}
