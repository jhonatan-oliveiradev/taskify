import Head from "next/head";
import { GetServerSideProps } from "next";
import { db } from "../../services/firebaseConnection";
import { doc, collection, query, where, getDoc } from "firebase/firestore";

import styles from "./styles.module.css";

export default function Task() {
	return (
		<>
			<Head>
				<title>Detalhes | Taskify+</title>
			</Head>
			<main className={styles.main}>
				<h1>Task</h1>
			</main>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const id = params?.id as string;

	const docRef = doc(db, "tasks", id);

	const snapshot = await getDoc(docRef);

	if (snapshot.data() === undefined) {
		return {
			redirect: {
				destination: "/dashboard",
				permanent: false,
			},
		};
	}

	if (!snapshot.data()?.public) {
		return {
			redirect: {
				destination: "/dashboard",
				permanent: false,
			},
		};
	}

	const milliseconds = snapshot.data()?.created?.seconds * 1000;

	const task = {
		task: snapshot.data()?.task,
		created: new Date(milliseconds).toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "long",
			year: "numeric",
		}),
		user: snapshot.data()?.user,
		taskId: snapshot.id,
	};

	return {
		props: {
			id,
		},
	};
};
