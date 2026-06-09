/// <reference types="node" />

import Groq from "groq-sdk";

export async function POST(
  req: Request
) {

  try {

    /*
      API KEY CHECK
    */

    if (
      !process.env.GROQ_API_KEY
    ) {

      return Response.json(
        {
          error:
            "Missing GROQ_API_KEY",
        },
        {
          status: 500,
        }
      );
    }

    /*
      GROQ CLIENT
    */

    const groq =
      new Groq({
        apiKey:
          process.env.GROQ_API_KEY,
      });

    /*
      REQUEST BODY
    */

    const body =
      await req.json();

    const {
      message,
      businessData,
    } = body;

    /*
      AI REQUEST
    */

    const completion =
      await groq.chat.completions.create({

        model:
          "llama-3.3-70b-versatile",

        messages: [

          {
            role: "system",

            content: `
You are Nova AI.

You are an AI assistant for a business management app.

Help users:
- analyze profits
- analyze expenses
- analyze inventory
- analyze debts
- improve business growth

Keep responses:
- concise
- practical
- smart
- easy to understand
            `,
          },

          {
            role: "user",

            content: `
Business Data:
${JSON.stringify(
  businessData
)}

Question:
${message}
            `,
          },
        ],

        temperature: 0.7,

        max_tokens: 500,
      });

    /*
      RESPONSE
    */

    return Response.json({

      reply:
        completion.choices?.[0]
          ?.message?.content ||
        "No AI response",
    });

  } catch (error: any) {

    console.log(
      "GROQ ERROR:",
      error
    );

    return Response.json(
      {
        error:
          error.message ||
          "Groq AI failed",
      },
      {
        status: 500,
      }
    );
  }
}