import {Label} from "~/components/ui/label";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {Github, MessageCircleCode} from "lucide-react";
import {useState} from "react";
import AjaxForm from "~/components/custom/forms/ajax-form";

export default function () {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-6">

                            <div className="flex flex-col items-center gap-2">
                                <a
                                    href="#"
                                    className="flex flex-col items-center gap-2 font-medium"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md">
                                        <MessageCircleCode className="size-6" />
                                    </div>
                                    <span className="sr-only">ChatApp</span>
                                </a>
                                <h1 className="text-xl font-bold">Welcome to InstaChat</h1>
                                <div className="text-center text-sm">
                                    Enter your email adress in order to authenticate to our website
                                </div>
                            </div>

                            <EmailForm />

                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                    Or
                                </span>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Button variant="outline" className="w-full">
                                    <Github />
                                    Continue with GitHub
                                </Button>
                                <Button variant="outline" className="w-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Continue with Google
                                </Button>
                            </div>
                        </div>
                    <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
                        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                        and <a href="#">Privacy Policy</a>.
                    </div>
                </div>
            </div>
        </div>
    )
}

function EmailForm() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Record<string, any>|null>(null);

    function onSubmit({ responseData, loading }: { responseData: Record<string, any>, loading: boolean }) {
        setLoading(loading)
        setData(responseData)
    }

    return (
        <AjaxForm handleSubmit={onSubmit} className="flex flex-col gap-6" action="/auth/is-registered" method={"post"}>
            {data && <span>{JSON.stringify(data)}</span>}
            <div className="grid gap-2">
                <Label htmlFor='email'>Email</Label>
                <Input name={"email"} id="email" type="email" placeholder="m@example.com" required />
            </div>

            {loading ? <div>Loading....</div> : <Button type={"submit"} className={"w-full"}>Login</Button>}
        </AjaxForm>
    );
}