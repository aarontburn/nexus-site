"use client";

import { Ref, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";
import { NexusLogo, VerticalSpacer } from "../../components/Components";
import { register } from "../../api/auth/register";



export default function RegisterPage() {
    const [error, setError] = useState("");
    const router = useRouter();

    const nameRef: Ref<HTMLInputElement | null> = useRef(null);
    const emailRef: Ref<HTMLInputElement | null> = useRef(null);
    const passwordRef: Ref<HTMLInputElement | null> = useRef(null);
    const confirmPasswordRef: Ref<HTMLInputElement | null> = useRef(null);


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
            return router.push("/marketplace/login");
        }
    };



    return <div className={styles["container"]}>
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

            <input
                ref={passwordRef}
                type="password"
                placeholder="Password"
                className={styles["input-field"]}
                name="password" />

            <input
                ref={confirmPasswordRef}
                type="password"
                placeholder="Confirm Password"
                className={styles["input-field"]}
                name="password" />

            {error && <div className={styles.error}>{error}</div>}

            <VerticalSpacer size={"1rem"} />

            <button onClick={() => handleSubmit()}>
                Register
            </button>

            <VerticalSpacer size={"1rem"} />

            <div className={styles["no-account"]}>
                <p>Already have an account?</p>
                <a href="/marketplace/login">Login to your account</a>
            </div>

        </div>
    </div>
}