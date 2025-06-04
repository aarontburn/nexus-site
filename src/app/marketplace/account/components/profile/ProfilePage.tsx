import { SessionContextValue } from "next-auth/react"
import styles from "./styles.module.css"

interface Props {
    session: SessionContextValue;
    setNotificationText: (message: string) => void;
}

export default function ProfilePage(props: Props) {
    return <>
        <p>{props.session.data?.user.name}</p>
        <p>{props.session.data?.user.email}</p>
        <p>{props.session.data?.user.id}</p>
    </>
}