import AuthBrandPanel from "@/components/AuthBrandPanel";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="auth-page min-h-[100svh] overflow-hidden bg-[#f7f9fc]">
      <div className="mx-auto grid min-h-[100svh] max-w-[1600px] lg:grid-cols-[minmax(0,1.03fr)_minmax(440px,0.97fr)]">
        <AuthBrandPanel
          eyebrow="Ekosistem pendidikan swasta"
          headline="Terhubung. Berkolaborasi. Bertumbuh."
          description="Platform kolaborasi dan informasi bagi ekosistem pendidikan BMPS Bogor."
        />
        <section className="flex items-center justify-center px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-10">
          <LoginForm />
        </section>
      </div>
    </div>
  );
}