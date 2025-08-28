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
        <div className="flex justify-center items-center -mt-2 md:-mt-3 lg:-mt-4">
          <span className="block font-bold text-4xl text-center">
            고객과 대화하는 데스커 AI 로<br/>
            떠나는 고객을 붙잡아 매출로 전환하세요
          </span>
        </div>
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
