import Image from "next/image";

const LandingPage = () => {
  return (
    <main>
      <div className="px-6 -mt-4 md:-mt-6 lg:-mt-8">
        <Image
          src="/desker-logo.png"
          width={150}
          height={150}
          alt="Desker Logo"
        />
        <div className="flex justify-center items-center rounded-lg bg-brown-400 p-0.5 ">
          <Image
            src="/information-section-image.png"
            width={1280}
            height={853}
            alt="Landing Information Section Image"
          />
        </div>
      </div>
    </main>
  );
}

export default LandingPage;
