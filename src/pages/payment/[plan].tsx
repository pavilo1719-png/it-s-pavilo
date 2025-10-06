import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default function PaymentPage() {
  const router = useRouter();
  const { plan } = router.query;
  const [user, setUser] = useState<any>(null);
  const [confirmed, setConfirmed] = useState(false);

  const plans: Record<
    string,
    { name: string; price: number; qr: string; upi: string }
  > = {
    basic: {
      name: "Basic",
      price: 999,
      qr: "/basic-qr.png",
      upi: "yourupiid@okaxis",
    },
    pro: {
      name: "Pro",
      price: 1499,
      qr: "/pro-qr.png",
      upi: "yourupiid@okaxis",
    },
    advance: {
      name: "Advance",
      price: 2499,
      qr: "/advance-qr.png",
      upi: "yourupiid@okaxis",
    },
  };

  const currentPlan = plan ? plans[plan as string] : null;

  // ✅ Get logged-in user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  // ✅ Handle "I have paid" click
  const handleConfirmPayment = async () => {
    if (!user) {
      alert("Please log in first!");
      return;
    }

    const { error } = await supabase.from("subscriptions").insert([
      {
        user_id: user.id,
        plan_name: currentPlan?.name.toLowerCase(),
        price: currentPlan?.price,
        status: "pending",
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error saving payment info");
    } else {
      setConfirmed(true);
    }
  };

  if (!currentPlan) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">Invalid plan selected.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">
        Pay ₹{currentPlan.price} for {currentPlan.name} Plan
      </h1>

      <Image
        src={currentPlan.qr}
        alt={`${currentPlan.name} QR`}
        width={250}
        height={250}
        className="rounded-xl border shadow-md"
      />

      <p className="mt-4 text-gray-600">
        Scan this QR or send ₹{currentPlan.price} to:
      </p>
      <p className="font-semibold text-lg mt-1">{currentPlan.upi}</p>

      {!confirmed ? (
        <button
          onClick={handleConfirmPayment}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          I have paid
        </button>
      ) : (
        <div className="mt-6 text-center">
          <p className="text-green-600 font-medium">
            Payment confirmation submitted ✅
          </p>
          <p className="text-sm text-gray-500 mt-1">
            We’ll verify and approve soon.
          </p>
        </div>
      )}
    </div>
  );
}
