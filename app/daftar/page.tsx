import AccountRegistrationForm from "@/components/AccountRegistrationForm";
import AuthBrandPanel from "@/components/AuthBrandPanel";

export default function RegisterPage() {
  return (
    <div className="auth-page min-h-[100svh] overflow-hidden bg-[#f7f9fc]">
      <div className="mx-auto grid min-h-[100svh] max-w-[1600px] lg:grid-cols-[minmax(0,1.03fr)_minmax(440px,0.97fr)]">
        <AuthBrandPanel
          eyebrow="Komunitas pendidikan BMPS"
          headline="Bergabung dan bertumbuh bersama."
          description="Bangun kolaborasi dan akses layanan BMPS Bogor dalam satu platform."
        />
        <section className="flex items-center justify-center px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-10">
          <AccountRegistrationForm />
        </section>
      </div>
    </div>
  );
}