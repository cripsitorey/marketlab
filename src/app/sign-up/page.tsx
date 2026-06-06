import { SignUpContent } from "@/components/marketlab/sign-up-content";

type SignUpPageProps = {
  searchParams: Promise<{
    error?: string;
    "check-email"?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;

  return (
    <SignUpContent
      error={params.error}
      checkEmail={params["check-email"] === "1"}
    />
  );
}
