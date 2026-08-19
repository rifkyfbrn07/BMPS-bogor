import RegistrationForm from "@/components/RegistrationForm";
import RegistrationStatusForm from "@/components/RegistrationStatusForm";

export default function SchoolRegistrationPage() {
  return (
    <div className="section-shell py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-4xl">
        <RegistrationForm />
        <div className="mt-8"><RegistrationStatusForm /></div>
      </div>
    </div>
  );
}
