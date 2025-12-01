import dbConnect from "@/lib/mongodb";
import Purchase from "@/models/Purchase";
import User from "@/models/User";
import Session from "@/models/Session";
import { getServerSession } from "next-auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const debug = searchParams.get('debug');
    
    await dbConnect();
    
    // Debug mode - show all purchases (admin only)
    if (debug === 'true') {
      const allPurchases = await Purchase.find({})
        .sort({ createdAt: -1 })
        .limit(20);
      
      return Response.json({
        total: allPurchases.length,
        purchases: allPurchases.map(p => ({
          id: p._id,
          session_id: p.session_id,
          session_title: p.session_title,
          user_email: p.user_email,
          user_name: p.user_name,
          amount_paid: p.amount_paid,
          currency: p.currency,
          payment_status: p.payment_status,
          stripe_payment_intent_id: p.stripe_payment_intent_id,
          access_granted: p.access_granted,
          purchase_date: p.purchase_date,
          createdAt: p.createdAt
        }))
      });
    }
    
    // Regular user purchases
    const session = await getServerSession();

    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user by email to get the correct userId
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const purchases = await Purchase.find({
      user_email: session.user.email,
      payment_status: "completed",
    });

    // Get session details for each purchase
    const purchasesWithSessions = await Promise.all(
      purchases.map(async (purchase) => {
        const sessionData = await Session.findById(purchase.session_id);
        return {
          ...purchase.toObject(),
          session: sessionData
        };
      })
    );

    return Response.json(purchasesWithSessions);
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { session_id, session_title, amount_paid, payment_status, payment_date, user_email, currency } = await request.json();

    await dbConnect();

    const purchase = await Purchase.create({
      session_id,
      session_title,
      user_email: user_email,
      amount_paid,
      currency: currency || 'AED',
      payment_status,
      access_granted: true,
      purchase_date: payment_date || new Date()
    });

    return Response.json(purchase, { status: 201 });
  } catch (error) {
    console.error("Error creating purchase:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
