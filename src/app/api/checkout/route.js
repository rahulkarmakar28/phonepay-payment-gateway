import { NextResponse } from 'next/server';
import crypto from 'crypto';

const salt_key = process.env.SALT_KEY;
const merchant_id = process.env.MERCHANT_ID;
const keyIndex = process.env.KEY_INDEX;

export async function POST(request) {
    try {
        const { name, mobile, amount, transactionId } = await request.json();
        const data = {
            merchantId: merchant_id,
            merchantTransactionId: transactionId,
            merchantUserId: mobile,
            name,
            amount: amount * 100, // amount in paise
            mobileNumber: mobile,
            redirectUrl: `http://localhost:3000/api/status?id=${transactionId}`,
            callbackUrl: `http://localhost:3000/api/status?id=${transactionId}`,
            redirectMode: "POST",
            paymentInstrument: {
                type: "PAY_PAGE",
            }
        };
        // console.log(data)
        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const string = payloadMain + "/pg/v1/pay" + salt_key;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + "###" + keyIndex;

        const response = await fetch("https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay", {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            body: JSON.stringify({ request: payloadMain })
        });
        const resData = await response.json();
        // console.log(resData.data.instrumentResponse.redirectInfo.url)
        const redirectUrl = resData.data?.instrumentResponse?.redirectInfo?.url;

        if (!redirectUrl) {
            return NextResponse.json({ error: "Redirect URL not found", resData }, { status: 500 });
        }

        return NextResponse.json({ url: redirectUrl }, { status: 200 });
    } catch (error) {
        // console.error("PhonePe Checkout Error:", error);
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Unknown error", detail: JSON.stringify(error) }, { status: 500 });
    }

}
