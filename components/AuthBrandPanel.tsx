import Image from "next/image";

type AuthBrandPanelProps = {
  eyebrow: string;
  headline: string;
  description: string;
};

export default function AuthBrandPanel({ eyebrow, headline, description }: AuthBrandPanelProps) {
  return (
    <section className="auth-brand-panel relative isolate flex min-h-[300px] flex-col justify-between overflow-hidden px-6 py-8 text-white sm:px-10 sm:py-10 lg:min-h-[100svh] lg:px-[clamp(3rem,7vw,7.5rem)] lg:py-14">
      <div className="auth-grid absolute inset-0 -z-10 opacity-30" aria-hidden="true" />
      <div className="auth-orbit auth-orbit-one absolute -right-24 -top-28 -z-10 h-80 w-80 rounded-full border border-white/15" aria-hidden="true" />
      <div className="auth-orbit auth-orbit-two absolute -bottom-48 left-1/3 -z-10 h-[28rem] w-[28rem] rounded-full border border-blue-200/10" aria-hidden="true" />

      <div className="animate-fade-in-up relative flex items-center gap-4">
        <div className="flex h-[58px] w-[58px] items-center justify-center rounded-2xl bg-white p-1.5 shadow-[0_14px_35px_rgba(4,18,56,0.22)] sm:h-16 sm:w-16">
          <Image src="/logo.png" alt="Logo BMPS" width={64} height={64} className="h-full w-full object-contain" priority unoptimized />
        </div>
        <div>
          <p className="text-lg font-bold tracking-[0.2em]">BMPS</p>
          <p className="mt-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-blue-100">Bogor</p>
        </div>
      </div>

      <div className="animate-fade-in-up relative mt-10 max-w-xl [animation-delay:120ms] lg:mt-0">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">{eyebrow}</p>
        <h1 className="max-w-[13ch] text-4xl font-bold leading-[1.05] tracking-[-0.025em] sm:text-5xl lg:text-6xl">{headline}</h1>
        <p className="mt-6 max-w-md text-sm leading-7 text-blue-100 sm:text-base">{description}</p>
      </div>

      <div className="relative mt-10 hidden items-center gap-3 text-xs font-medium tracking-wide text-blue-100/80 lg:flex">
        <span className="h-px w-10 bg-blue-200/50" />
        <span>Kolaborasi untuk pendidikan yang lebih kuat</span>
      </div>
    </section>
  );
}