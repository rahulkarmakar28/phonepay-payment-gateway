import { NextResponse } from 'next/server';
import crypto from 'crypto';

const salt_key = process.env.SALT_KEY;
const merchant_id = process.env.MERCHANT_ID;
const keyIndex = process.env.KEY_INDEX;

async function checkPaymentStatus(merchantTransactionId) {
  const string = `/pg/v1/status/${merchant_id}/${merchantTransactionId}${salt_key}`;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  const checksum = `${sha256}###${keyIndex}`;

  const statusUrl = `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchant_id}/${merchantTransactionId}`;
  const response = await fetch(statusUrl, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'X-VERIFY': checksum,
      'X-MERCHANT-ID': merchant_id
    }
  });

  const result = await response.json();
  return result;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('id');

    if (!transactionId) throw new Error("Missing transaction ID");

    const status = await checkPaymentStatus(transactionId);
    console.log("Payment status:", status);

    if (status.code === 'PAYMENT_SUCCESS') {
      return NextResponse.redirect('http://localhost:3000/success', 301);
    } else {
      return NextResponse.redirect('http://localhost:3000/fail', 301);
    }

  } catch (err) {
    console.error("Status GET error:", err);
    return NextResponse.redirect('http://localhost:3000/fail', 301);
  }
}

export async function POST(request) {
  try {
    const body = await request.formData();
    const transactionId = body.get('transactionId') || body.get('id');

    if (!transactionId) throw new Error("Missing transaction ID");

    const status = await checkPaymentStatus(transactionId);
    // console.log("Payment status (POST):", status);

    if (status.code === 'PAYMENT_SUCCESS') {
      return NextResponse.redirect('http://localhost:3000/success', 301);
    } else {
      return NextResponse.redirect('http://localhost:3000/fail', 301);
    }

  } catch (err) {
    console.error("Status POST error:", err);
    return NextResponse.redirect('http://localhost:3000/fail', 301);
  }
}
