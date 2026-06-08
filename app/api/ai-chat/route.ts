import OpenAI from "openai";

const openai =
  new OpenAI({
    apiKey:
      process.env.OPENAI_API_KEY,
  });

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const {
      message,
      businessData,
    } = body;

    const completion =
      await openai.chat.completions.create({

        model: "gpt-4.1-mini",

        messages: [

          {
            role: "system",

            content: `
You are a smart AI business assistant.

Analyze:
- sales
- expenses
- inventory
- debts
- profits

Give concise business advice.
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

    return Response.json({

      reply:
        completion.choices[0]
          .message.content,
    });

  } catch (error) {

    console.log(error);

    return Response.json(
      {
        error:
          "AI failed",
      },
      {
        status: 500,
      }
    );
  }
}