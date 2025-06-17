"use client";

import { Ref, useEffect, useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import styles from "./login.module.css";
import { NexusLogo, VerticalSpacer } from "../../components/Components";



export default function LoginPage() {
    const session = useSession();
    const router = useRouter();

    const [error, setError] = useState("");
    const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const emailRef: Ref<HTMLInputElement | null> = useRef(null);
    const passwordRef: Ref<HTMLInputElement | null> = useRef(null);

    useEffect(() => {
        if (session.status === "authenticated") {
            router.push('/marketplace')
        }
    }, [session]);

    const handleSubmitWrapper = () => {
        setIsSubmitting(true);
        handleSubmit().then(() => setIsSubmitting(false))
    }

    const handleSubmit = async () => {
        if (!emailRef.current?.value) {
            setError("Enter an email address.");
            return;
        }

        if (!passwordRef.current?.value) {
            setError("Enter a password.");
            return;
        }

        const res = await signIn("credentials", {
            email: emailRef.current?.value,
            password: passwordRef.current?.value,
            redirect: false,
        });

        if (res?.error) {
            setError(res.error as string);
        }
        if (res?.ok) {
            return router.push("/marketplace");
        }
    };



    return <>
        <div className={styles["container"]}>

            <div className={styles["login-container"]}>

                <NexusLogo width={"6rem"} height="6rem" />

                <h1>Nexus Marketplace</h1>
                <h2>Login</h2>

                <VerticalSpacer size={"1rem"} />

                <input
                    ref={emailRef}
                    type="email"
                    placeholder="Email"
                    className={styles["input-field"]}
                    name="email" />

                <div className={styles['password']}>
                    <input
                        ref={passwordRef}
                        type={isPasswordShown ? "text" : "password"}
                        placeholder="Password"
                        className={styles["input-field"]}
                        name="password" />
                    <input onChange={(event) => setIsPasswordShown(event.target.checked)} className={styles["show-password"]} type="checkbox" />
                </div>


                {error && <div className={styles.error}>{error}</div>}

                <VerticalSpacer size={"1rem"} />

                <button disabled={isSubmitting} onClick={() => handleSubmitWrapper()}>
                    Login
                </button>

                <VerticalSpacer size={"1rem"} />

                <div className={styles["no-account"]}>
                    <p>Don't have an account?</p>
                    <a href="/marketplace/register">Create an account</a>
                </div>

            </div>
        </div>
    </>
}