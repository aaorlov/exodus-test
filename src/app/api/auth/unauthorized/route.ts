import {NextResponse} from "next/server";


export async function POST() {
  return NextResponse.json({ message: 'Not authenticated.' }, {status: 401})
}

export async function GET() {
  return NextResponse.json({ message: 'Not authenticated.' }, {status: 401})
}

export async function PUT() {
  return NextResponse.json({ message: 'Not authenticated.' }, {status: 401})
}

export async function DELETE() {
  return NextResponse.json({ message: 'Not authenticated.' }, {status: 401})
}

export async function PATCH() {
  return NextResponse.json({ message: 'Not authenticated.' }, {status: 401})
}