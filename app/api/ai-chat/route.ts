/// <reference types="node" />
import OpenAI from "openai";

export async function POST(
  req: Request
) {

  try {

    /*
      CHECK API KEY
    */

    if (
      !process.env.OPENAI_API_KEY
    ) {

      return Response.json(
        {
          error:
            "Missing OpenAI API key",
        },
        {
          status: 500,
        }
      );
    }

    /*
      OPENAI CLIENT
    */

    const openai =
      new OpenAI({
        apiKey:
          process.env.OPENAI_API_KEY,
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
      await openai.chat.completions.create({

        model: "gpt-4.1-mini",

        messages: [

          {
            role: "system",

            content: `
You are an AI business assistant.

Analyze:
- sales
- expenses
- inventory
- debts
- profits

Give concise advice.
            `,
          },

          {
            role: "user",

            content: `
Business Data:
${JSON.stringify(businessData)}

Question:
${message}
            `,
          },
        ],
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
      "AI ERROR:",
      error
    );

    return Response.json(
      {
        error:
          error.message ||
          "AI failed",
      },
      {
        status: 500,
      }
    );
  }
}
