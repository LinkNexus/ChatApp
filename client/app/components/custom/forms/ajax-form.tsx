import {
    type ComponentProps,
    type PropsWithChildren,
    type SyntheticEvent,
    useCallback,
    useEffect,
    useState
} from "react";
import {useApiFetch} from "~/lib/custom/fetch";

type AjaxFormProps = PropsWithChildren<ComponentProps<'form'> & {
    handleSubmit?: (({ responseData, error, loading }: { responseData: any, error: any, loading: boolean }) => void)|null;
}>

export default function ({ action, method = 'GET', handleSubmit = null, children, ...props }: AjaxFormProps) {
    const { load, error, loading } = useApiFetch(action as string, { method });
    const [responseData, setResponseData] = useState<any>(null);

    useEffect(function () {
        if (handleSubmit) {
            handleSubmit({ responseData, error, loading });
        }
    }, [responseData, error, loading]);

    const onSubmit = useCallback(async function (event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setResponseData(await load(Object.fromEntries(formData.entries())));
    }, [load, setResponseData]);

    return (
        <form onSubmit={onSubmit} action={action} method={method} {...props}>
            {children}
        </form>
    );
}