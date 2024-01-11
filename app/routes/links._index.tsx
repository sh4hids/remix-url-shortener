import { LoaderFunction, MetaFunction, json } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Links" },
    { name: "description", content: "Generate Shortened Links!" },
  ];
};

export async function loader() {
  return json({ ok: true });
}

export default function Links() {
  return (
    <>
      <p>Generate Links</p>
    </>
  );
}
