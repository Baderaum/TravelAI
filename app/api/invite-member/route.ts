import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request
) {
  try {

    const supabase =
      await createClient();

    const body =
      await request.json();

    const {
      tripId,
      email,
    } = body;

    // FIND USER
    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (profileError || !profile) {

      return NextResponse.json(
        {
          error:
            "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // CHECK IF ALREADY MEMBER
    const {
      data: existingMember,
    } = await supabase
      .from("trip_members")
      .select("trip_id")
      .eq("trip_id", tripId)
      .eq("user_id", profile.id)
      .single();

    if (existingMember) {

      return NextResponse.json(
        {
          error:
            "User already invited",
        },
        {
          status: 400,
        }
      );
    }

    // ADD MEMBER
    const {
      error: insertError,
    } = await supabase
      .from("trip_members")
      .insert({
        trip_id: tripId,
        user_id: profile.id,
        role: "member",
      });

    if (insertError) {

      console.error(insertError);

      return NextResponse.json(
        {
          error:
            "Failed to invite member",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}