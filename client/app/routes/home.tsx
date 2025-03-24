import Redirect from "~/components/custom/auth/redirect";
import type { Route } from "./+types/home";
import { useAccount } from "~/lib/custom/auth";
import type { User } from "~/types";
import { apiFetch } from "~/lib/custom/fetch";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader({}: Route.LoaderArgs) {
  return await apiFetch<any>('/flashes');
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { user } = useAccount();

  // console.log(loaderData);

  return (
      <Redirect>
        <h1>Hello</h1>
        <button onClick={() => {
          apiFetch<User>("/auth/me").then(console.log).catch(console.error);
        }}>Hi</button>
      </Redirect>
  );
}
