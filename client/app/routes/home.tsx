import Redirect from "~/components/custom/auth/redirect";
import type { Route } from "./+types/home";
import { useAccount } from "~/lib/custom/auth";
import Flashes from "~/components/custom/flashes";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Welcome to InstaChat" },
    { name: "description", content: "InstaChat is a Symfony-based Messaging system combining the power of React Router and Mercure!"},
  ];
}

export default function Home() {
  const { user } = useAccount();

  return (
    <Redirect>
      <Flashes>
        <h1>Hello</h1>
      </Flashes>
    </Redirect>
  );
}
