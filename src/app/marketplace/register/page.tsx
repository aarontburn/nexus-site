"use client";

import { Ref, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";
import { NexusLogo, VerticalSpacer } from "../../components/Components";
import { register } from "../../api/auth/register";
import MarketplaceHeader from "../MarketplaceHeader";
import { useSession } from "next-auth/react";



export default function RegisterPage() {
    const session = useSession();
    const router = useRouter();

    const [error, setError] = useState("");
    const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const nameRef: Ref<HTMLInputElement | null> = useRef(null);
    const emailRef: Ref<HTMLInputElement | null> = useRef(null);
    const passwordRef: Ref<HTMLInputElement | null> = useRef(null);
    const confirmPasswordRef: Ref<HTMLInputElement | null> = useRef(null);

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
        if (!nameRef.current?.value) {
            setError("Enter a name.");
            return;
        }

        if (!emailRef.current?.value) {
            setError("Enter a email address.");
            return;
        }

        if (!passwordRef.current?.value) {
            setError("No password provided.");
            return;
        }

        if (!confirmPasswordRef.current?.value) {
            setError("Double check your password.");
            return;
        }

        if (passwordRef.current?.value && confirmPasswordRef.current?.value
            && passwordRef.current.value !== confirmPasswordRef.current.value) {
            setError("Passwords don't match.");
            return;
        }

        const response: any = await register({
            email: emailRef.current?.value,
            password: passwordRef.current?.value,
            name: nameRef.current?.value
        });

        if (response?.message) {
            setError(response.message);
            return;
        } else {
            router.push("/marketplace/login");
        }
    };



    return <>
        <MarketplaceHeader />
        <div className={styles["container"]}>
            <div className={styles["login-container"]}>
                <NexusLogo width={"6rem"} height="6rem" />

                <h1>Nexus Marketplace</h1>
                <h2>Registration</h2>
                <VerticalSpacer size={"1rem"} />


                <input
                    ref={nameRef}
                    type="text"
                    placeholder="Name"
                    className={styles["input-field"]}
                    name="name" />

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

                <input
                    ref={confirmPasswordRef}
                    type={isPasswordShown ? "text" : "password"}
                    placeholder="Confirm Password"
                    className={styles["input-field"]}
                    name="password" />



                {error && <div className={styles.error}>{error}</div>}

                <VerticalSpacer size={"1rem"} />

                <button disabled={isSubmitting} onClick={() => handleSubmitWrapper()}>
                    Register
                </button>

                <VerticalSpacer size={"1rem"} />

                <div className={styles["no-account"]}>
                    <p>Already have an account?</p>
                    <a href="/marketplace/login">Login to your account</a>
                </div>

            </div>
        </div>
    </>

}