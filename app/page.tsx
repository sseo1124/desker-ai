import Image from "next/image";
import Link from "next/link";

const LandingPage = () => {
  return (
    <>
      <header className="px-6 -mt-4 md:-mt-6 lg:-mt-8">
        <Image
          src="/desker-logo.png"
          width={150}
          height={150}
          alt="Desker Logo"
          priority
        />
      </header>
      <main>
        <div className="flex justify-center items-center -mt-2 md:-mt-3 lg:-mt-4">
          <h1 className="block font-bold text-4xl text-center">
            고객과 대화하는 데스커 AI 로<br />
            떠나는 고객을 붙잡아 매출로 전환하세요
          </h1>
        </div>
        <div className="pb-10"></div>
        <div className="flex justify-center items-center gap-10 pb-10">
          <Link
            href="/login"
            className="text-aline gap-5 self-start rounded-lg bg-brown-300 px-7 py-3.5 text-base md:px-8 md:py-4 md:text-lg lg:px-10 lg:py-5 lg:text-xl font-medium text-black transition-colors hover:bg-brown-900 hover:text-white"
          >
            <span>로그인 하기</span>
          </Link>
          <Link
            href="/demo"
            className="text-aline gap-5 self-start rounded-lg bg-brown-700 px-7 py-3.5 text-base md:px-8 md:py-4 md:text-lg lg:px-10 lg:py-5 lg:text-xl font-medium text-white transition-colors hover:bg-brown-200 hover:text-black"
          >
            <span>무료로 체험하기</span>
          </Link>
        </div>
        <section className="flex justify-center items-center rounded-lg bg-brown-400 p-0.5 ">
          <Image
            src="/information-section-image.png"
            width={1280}
            height={853}
            alt="Landing Information Section Image"
            priority
          />
        </section>
      </main>
    </>
  );
};

export default LandingPage;
