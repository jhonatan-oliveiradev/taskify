import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { Textarea } from "@/components/Textarea";

import styles from "./dashboard.module.css";

export default function Dashboard() {
	return (
		<div className={styles.container}>
			<Head>
				<title>Tarefas+ | Meu painel de tarefas</title>
			</Head>

			<main className={styles.main}>
				<section className={styles.content}>
					<div className={styles.contentForm}>
						<h1 className={styles.title}>Qual sua tarefa?</h1>
						<form>
							<Textarea placeholder="Digite sua tarefa aqui..." />
							<div className={styles.checkboxArea}>
								<input type="checkbox" className={styles.checkbox} />
								<label>Deixar tarefa publica?</label>
							</div>

							<button type="submit" className={styles.button}>
								Registrar
							</button>
						</form>
					</div>
				</section>
				<section className={styles.taskContainer}>
					<h2>Minhas Tarefas</h2>
					<article className={styles.task}>
						<div className={styles.tagContainer}>
							<label className={styles.tag}>PÚBLICA</label>
						</div>
					</article>
				</section>
			</main>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const session = await getSession({ req });

	if (!session?.user) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}
	return {
		props: {},
	};
};
