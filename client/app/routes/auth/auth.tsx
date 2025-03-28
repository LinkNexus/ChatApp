import {Label} from "~/components/ui/label";
import {Input} from "~/components/ui/input";
import {useState} from "react";
import AjaxForm from "~/components/custom/forms/ajax-form";
import {Navigate} from "react-router";
import LoadingButton from "~/components/custom/forms/loading-button";
import { useStore } from "~/store";
import Header from "~/components/custom/auth/header";

enum RegistrationStatus {
    Unknown = 'unknown',
    Registered = 'registered',
    NotRegistered = 'not-registered'
}

export default function () {
    const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus>(RegistrationStatus.Unknown);
    const setEmail = useStore.getState().setEmail;
    const email = useStore.use.email();
    const [loading, setLoading] = useState(false);

    const onResponse = (response: { isRegistered: boolean }) => {
        if (response.isRegistered) {
            setRegistrationStatus(RegistrationStatus.Registered)
        } else {
            setRegistrationStatus(RegistrationStatus.NotRegistered)
        }
    }

    switch (registrationStatus) {
        case RegistrationStatus.Unknown:
            return (
                <>
                    <Header message="Welcome to InstaChat">
                        <span>
                            Enter your email adress in order to authenticate to our website
                        </span>
                    </Header>

                    <AjaxForm
                        getFormData={(formData) => setEmail(formData.get('email')!.toString())}
                        onResponse={onResponse}
                        handleLoading={setLoading}
                        className="flex flex-col gap-6"
                        action="/auth/is-registered"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor='email'>Email</Label>
                            <Input defaultValue={email} name={"email"} id="email" type="email" placeholder="m@example.com" required />
                        </div>

                        <LoadingButton loading={loading} type={"submit"} className={"w-full"}>
                            Submit
                        </LoadingButton>
                    </AjaxForm>
                </>
            )

        case RegistrationStatus.Registered:
            return <Navigate to="/auth/login" />

        case RegistrationStatus.NotRegistered:
            return <Navigate to="/auth/register" />
    }
}