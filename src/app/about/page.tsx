import Image from "next/image";

export default function About() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-4xl">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Learn more about our mission and the team behind PaperFans IOTA.
          </p>
        </div>

        <div className="grid gap-8 w-full">
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We're building the future of decentralized content creation and
              curation on the IOTA network. Our platform empowers creators and
              communities to collaborate, share, and monetize their work in a
              truly decentralized way.
            </p>
          </section>

          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">The Team</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Our team consists of passionate developers, designers, and
              blockchain enthusiasts dedicated to revolutionizing how content is
              created and shared on the web.
            </p>
          </section>

          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">Technology</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Built on IOTA's feeless and scalable distributed ledger
              technology, PaperFans provides a seamless experience for content
              creators and consumers alike.
            </p>
          </section>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-8">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/docs"
          >
            Read Documentation
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
            href="/"
          >
            Back to Home
          </a>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Back to Home
        </a>
      </footer>
    </div>
  );
}
