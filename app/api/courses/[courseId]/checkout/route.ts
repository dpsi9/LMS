import { db } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(
    req: Request,
    { params}: { params: { courseId: string } }
) {
    try {
        const user = await currentUser();
        if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                isPublished: true,
            }
        });

        if (!course) {
            return new NextResponse("Not found", { status: 404 });
          }

        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: params.courseId
                }
            }
        })

        if(purchase) {
            return new NextResponse("Already purchased", { status: 400 });
        }

        if(!course) {
            return new NextResponse("Not found", { status: 404 });
        }

        const options = {
            amount: course.price! * 100, // Amount is in paise (multiply by 100 for INR)
            currency: "INR",
            receipt: `receipt_${params.courseId}_${user.id}`,
            notes: {
              courseTitle: course.title,
              courseDescription: course.description,
              userId: user.id,
              userEmail: user.emailAddresses[0].emailAddress,
            },
          };

          let razorpayCusomer = await db.razorpayCustomer.findUnique({
                where: {
                    userId: user.id
                },
                select: {
                    razorpayCustomerId: true,
                }
          })
          
          if(!razorpayCusomer) {
                const customer = await razorpay.customers.create({
                    email: user.emailAddresses[0].emailAddress,
                });
                razorpayCusomer = await db.razorpayCustomer.create({
                    data: {
                        userId: user.id,
                        razorpayCustomerId: customer.id,
                    }
                });
          }

          const order = await razorpay.orders.create(options);

          return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
          });
    } catch (error) {
        console.log("[COURSE_ID_CHECKOUT]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}