import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth/actions";

type SignUpContentProps = {
  error?: string;
  checkEmail?: boolean;
};

export function SignUpContent({ error, checkEmail }: SignUpContentProps) {
  if (checkEmail) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-12">
        <Card data-testid="check-email-state">
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We sent a confirmation link to your inbox. Open it to finish
              creating your MarketLab account.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/sign-in">Back to sign in</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>
            Sign up with fake money to trade on workshop markets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signUp} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">First name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  autoComplete="given-name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
              />
            </div>
            {error ? (
              <p
                className="text-sm text-destructive"
                data-testid="sign-up-error"
                role="alert"
              >
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full">
              Sign up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
