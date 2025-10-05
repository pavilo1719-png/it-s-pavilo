import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  // ✅ Sign in with Google
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/plans`,
      },
    });
    if (error) alert(error.message);
  };

  // ✅ Email Login Magic Link
  const handleEmailLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/plans` },
    });
    if (error) alert(error.message);
    else alert("Magic link sent! Check your email.");
  };

  // ✅ Send OTP to Phone
  const handleSendOtp = async () => {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) alert(error.message);
    else {
      setOtpSent(true);
      alert("OTP sent to your phone!");
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: "sms",
    });
    if (error) alert(error.message);
    else window.location.href = "/plans";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to Pavilo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Login */}
          <Button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            <FcGoogle size={20} />
            Continue with Google
          </Button>

          <div className="text-center text-muted-foreground my-2">or</div>

          {/* Email Login */}
          <div className="space-y-2">
            <Label>Email Login</Label>
            <Input
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={handleEmailLogin} className="w-full">
              Send Magic Link
            </Button>
          </div>

          <div className="text-center text-muted-foreground my-2">or</div>

          {/* Phone Login */}
          <div className="space-y-2">
            <Label>Phone Login</Label>
            <Input
              placeholder="+91XXXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {!otpSent ? (
              <Button onClick={handleSendOtp} className="w-full">
                Send OTP
              </Button>
            ) : (
              <>
                <Input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <Button onClick={handleVerifyOtp} className="w-full">
                  Verify OTP
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
