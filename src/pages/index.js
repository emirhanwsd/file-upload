import FileUpload from "@/components/file-upload";
import Head from "next/head";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Head>
        <title>File Upload</title>
      </Head>

      <main className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <FileUpload />
      </main>
    </div>
  );
};

export default Home;
