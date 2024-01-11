import type { DataFunctionArgs, MetaFunction } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState } from "react";
import { Input } from "~/components/Input";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";
import { db } from "~/db/config.server";
import { UrlData, links } from "~/db/schemas/links.server";
import { numberToBase62 } from "~/utils/base62";
import { eq } from "drizzle-orm";

type SuccessActionData<T> = {
  success: true;
  data: T;
};

const isSuccessActionData = (
  response: any
): response is SuccessActionData<UrlData> => !!response?.success;

export const meta: MetaFunction = () => {
  return [
    { title: "Linkly" },
    { name: "description", content: "Shorten any long URL!" },
  ];
};

const validator = withZod(
  z.object({
    url: z
      .string()
      .url()
      .refine(
        (val) => {
          console.log(val);

          return !(
            val.startsWith("http://localhost:3000") ||
            val.startsWith("localhost:3000")
          );
        },
        {
          message: "This domain is blocked",
        }
      ),
    intent: z.string().optional(),
  })
);

export const loader = () => {
  return json({
    defaultValues: {
      url: "",
      intent: "generateUrl",
    },
  });
};

export async function action({ request }: DataFunctionArgs) {
  const fieldValues = await validator.validate(await request.formData());

  if (fieldValues.error) {
    return validationError(fieldValues.error);
  }

  const existingUrl = await db
    .select()
    .from(links)
    .where(eq(links.url, fieldValues.data.url));

  if (existingUrl.length) {
    return json<SuccessActionData<UrlData>>({
      success: true,
      data: existingUrl[0],
    });
  }

  const newLink = await db
    .insert(links)
    .values({
      url: fieldValues.data.url,
    })
    .returning();

  const shortUrl = numberToBase62(newLink[0].id);

  const linkData = await db
    .update(links)
    .set({ shortUrl: `http://localhost:3000/${shortUrl}` })
    .where(eq(links.id, newLink[0].id))
    .returning();

  return json<SuccessActionData<UrlData>>({
    success: true,
    data: linkData[0],
  });
}

export default function Index() {
  const { defaultValues } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const data = isSuccessActionData(actionData) ? actionData.data : undefined;
  const navigation = useNavigation();
  const isGenerating = navigation.formData?.get("intent") === "generateUrl";

  const [isCopied, setIsCopied] = useState(false);

  // This is the function we wrote earlier
  async function copyTextToClipboard(text: string) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    if (!data?.shortUrl) {
      return;
    }
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(data.shortUrl)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        // setTimeout(() => {
        //   setIsCopied(false);
        // }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="container mx-auto pt-8">
      <div className="grid h-[calc(100vh_-_160px)] place-items-center">
        <div>
          <div className="pb-6">
            <ValidatedForm
              className="space-y-6"
              method="POST"
              validator={validator}
              defaultValues={defaultValues}
              action="/?index"
            >
              <Input type="hidden" name="intent" />
              <Input
                name="url"
                label="Your long url"
                placeholder="Enter a long url"
              />
              {isGenerating ? (
                <button
                  type="button"
                  disabled
                  className="w-full bg-indigo-600 opacity-50 cursor-not-allowed rounded-2xl tracking-wider py-4 px-8 text-zinc-50 uppercase"
                >
                  Shortening...
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-indigo-600 rounded-2xl tracking-wider py-4 px-8 text-zinc-50 uppercase"
                >
                  Shorten URL
                </button>
              )}
            </ValidatedForm>
          </div>

          {!isGenerating && data?.shortUrl && (
            <div className="text-center py-4 bg-zinc-200 rounded-2xl flex items-center justify-center">
              <span className="pr-4">{data.shortUrl}</span>
              <span>
                {!isCopied ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 inline cursor-pointer"
                    onClick={handleCopyClick}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 inline cursor-pointer text-lime-600"
                    onClick={handleCopyClick}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
                    />
                  </svg>
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
