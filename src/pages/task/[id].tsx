import Head from "next/head";
import { GetServerSideProps } from "next";
import { db } from "../../services/firebaseConnection";
import { doc, collection, query, where, getDoc } from "firebase/firestore";

import styles from "./styles.module.css";
import { Textarea } from "@/components/Textarea";

interface TaskProps {
	item: {
		task: string;
		created: string;
		public: boolean;
		user: string;
		taskId: string;
	};
}

export default function Task({ item }: TaskProps) {
	return (
		<div className={styles.container}>
			<Head>
				<title>Detalhes | Taskify+</title>
			</Head>
			<main className={styles.main}>
				<h1>Task</h1>
				<article className={styles.task}>
					<p>{item.task}</p>
				</article>
			</main>

			<section className={styles.commentsContainer}>
				<h2>Fazer um comentário</h2>
				<form>
					<Textarea placeholder="Digite seu comentário..." />
					<button className={styles.button}>Enviar comentário</button>
				</form>
			</section>
		</div>
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
			item: task,
		},
	};
};
