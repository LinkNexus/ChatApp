import { Button } from "~/components/ui/button";
import { LoadingSpinner } from "~/components/ui/spinner";

export default function ({ loading, ...props}: React.ComponentProps<typeof Button> & { loading: boolean }) {
    return (
        <Button>
            {loading ? <LoadingSpinner />: props.children}
        </Button>
    )
}