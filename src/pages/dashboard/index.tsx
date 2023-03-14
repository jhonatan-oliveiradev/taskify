import { ChangeEvent, FormEvent, useState } from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { Textarea } from "@/components/Textarea";
import { IoIosShareAlt } from "react-icons/io";
import { HiTrash } from "react-icons/hi";

import styles from "./dashboard.module.css";

export default function Dashboard() {
	const [input, setInput] = useState("");
	const [publicTask, setPublicTask] = useState(false);

	function handleChangePublic(e: ChangeEvent<HTMLInputElement>) {
		setPublicTask(e.target.checked);
	}

	function handleRegisterTask(e: FormEvent) {
		e.preventDefault();

		if (input === "") {
			return;
		} else {
			alert("Tarefa criada com sucesso!");
		}
	}

	return (
		<div className={styles.container}>
			<Head>
				<title>Tarefas+ | Meu painel de tarefas</title>
			</Head>

			<main className={styles.main}>
				<section className={styles.content}>
					<div className={styles.contentForm}>
						<h1 className={styles.title}>Qual sua tarefa?</h1>
						<form onSubmit={handleRegisterTask}>
							<Textarea
								value={input}
								onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
									setInput(e.target.value)
								}
								placeholder="Digite sua tarefa aqui..."
							/>
							<div className={styles.checkboxArea}>
								<input
									type="checkbox"
									className={styles.checkbox}
									checked={publicTask}
									onChange={handleChangePublic}
								/>
								<label>Deixar tarefa publica?</label>
							</div>

							<button type="submit" className={styles.button}>
								Criar Tarefa
							</button>
						</form>
					</div>
				</section>
				<section className={styles.taskContainer}>
					<h2>Minhas Tarefas</h2>
					<article className={styles.task}>
						<div className={styles.tagContainer}>
							<label className={styles.tag}>PÚBLICA</label>
							<button className={styles.shareButton}>
								<IoIosShareAlt size={22} color="#3183ff" />
							</button>
						</div>
						<div className={styles.taskContent}>
							<p>Minha tarefa de exemplo bla bla bla!</p>
							<button className={styles.trashButton}>
								<HiTrash size={24} color="#ea3140" />
							</button>
						</div>
					</article>

					<article className={styles.task}>
						<div className={styles.tagContainer}>
							<label className={styles.tag}>PÚBLICA</label>
							<button className={styles.shareButton}>
								<IoIosShareAlt size={22} color="#3183ff" />
							</button>
						</div>
						<div className={styles.taskContent}>
							<p>Minha tarefa de exemplo bla bla bla!</p>
							<button className={styles.trashButton}>
								<HiTrash size={24} color="#ea3140" />
							</button>
						</div>
					</article>

					<article className={styles.task}>
						<div className={styles.tagContainer}>
							<label className={styles.tag}>PÚBLICA</label>
							<button className={styles.shareButton}>
								<IoIosShareAlt size={22} color="#3183ff" />
							</button>
						</div>
						<div className={styles.taskContent}>
							<p>Minha tarefa de exemplo bla bla bla!</p>
							<button className={styles.trashButton}>
								<HiTrash size={24} color="#ea3140" />
							</button>
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
