import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { Textarea } from "@/components/Textarea";
import { IoIosShareAlt } from "react-icons/io";
import { HiTrash } from "react-icons/hi";
import Head from "next/head";
import Link from "next/link";

import { db } from "../../services/firebaseConnection";

import {
	addDoc,
	collection,
	query,
	orderBy,
	where,
	onSnapshot,
	doc,
	deleteDoc,
} from "firebase/firestore";

import { ToastContainer, toast } from "react-toastify";

import styles from "./dashboard.module.css";
import "react-toastify/dist/ReactToastify.css";

interface DashboardProps {
	user: {
		email: string;
	};
}

interface TaskProps {
	id: string;
	created: Date;
	public: boolean;
	task: string;
	user: string;
}

export default function Dashboard({ user }: DashboardProps) {
	const [input, setInput] = useState("");
	const [publicTask, setPublicTask] = useState(false);
	const [tasks, setTasks] = useState<TaskProps[]>([]);

	useEffect(() => {
		async function loadTasks() {
			const tasksRef = collection(db, "tasks");
			const q = query(
				tasksRef,
				orderBy("created", "desc"),
				where("user", "==", user?.email)
			);

			onSnapshot(q, (snapshot) => {
				let list = [] as TaskProps[];

				snapshot.forEach((doc) => {
					list.push({
						id: doc.id,
						created: doc.data().created,
						public: doc.data().public,
						task: doc.data().task,
						user: doc.data().user,
					});
				});

				setTasks(list);
			});
		}

		loadTasks();
	}, [user?.email]);

	function handleChangePublic(e: ChangeEvent<HTMLInputElement>) {
		setPublicTask(e.target.checked);
	}

	async function handleRegisterTask(e: FormEvent) {
		e.preventDefault();

		if (input === "") return;

		try {
			await addDoc(collection(db, "tasks"), {
				task: input,
				created: new Date(),
				user: user?.email,
				public: publicTask,
			});

			setInput("");
			setPublicTask(false);
		} catch (err) {
			console.log(err);
		}
	}

	async function handleShare(id: string) {
		await navigator.clipboard.writeText(
			`${process.env.NEXT_PUBLIC_URL}/task/${id}`
		);

		toast.success("Link copiado com sucesso!", {
			position: toast.POSITION.BOTTOM_RIGHT,
			className: styles.toastMessage,
		});
	}

	async function handleDeleteTask(id: string) {
		const docRef = doc(db, "tasks", id);
		await deleteDoc(docRef);

		if (deleteDoc === null) {
			toast.error("Erro ao excluir tarefa... tente novamente.", {
				position: toast.POSITION.BOTTOM_RIGHT,
				className: styles.toastMessage,
			});
		} else {
			toast.success("Tarefa excluida com sucesso!", {
				position: toast.POSITION.BOTTOM_RIGHT,
				className: styles.toastMessage,
			});
		}
	}

	return (
		<div className={styles.container}>
			<Head>
				<title>Painel | Taskify+</title>
			</Head>

			<main className={styles.main}>
				<section className={styles.content}>
					<div className={styles.contentForm}>
						<h1 className={styles.title}>Qual sua tarefa?</h1>
						<form onSubmit={handleRegisterTask}>
							<Textarea
								value={input}
								placeholder="Digite sua tarefa aqui..."
								onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
									setInput(e.target.value)
								}
							/>
							<div className={styles.checkboxArea}>
								<input
									type="checkbox"
									className={styles.checkbox}
									checked={publicTask}
									onChange={handleChangePublic}
								/>
								<label>Tornar tarefa publica?</label>
							</div>

							<button type="submit" className={styles.button}>
								Criar Tarefa
							</button>
						</form>
					</div>
				</section>

				<section className={styles.taskContainer}>
					<h2>Minhas Tarefas</h2>
					{tasks.map((item) => (
						<article key={item.id} className={styles.task}>
							{item.public && (
								<div className={styles.tagContainer}>
									<label className={styles.tag}>PÚBLICO</label>
									<button
										className={styles.shareButton}
										onClick={() => handleShare(item.id)}
									>
										<IoIosShareAlt size={22} color="#3183ff" />
										<ToastContainer />
									</button>
								</div>
							)}
							<div className={styles.taskContent}>
								{item.public ? (
									<Link href={`/task/${item.id}`}>
										<p>{item.task}</p>
									</Link>
								) : (
									<p>{item.task}</p>
								)}
								<button className={styles.trashButton}>
									<HiTrash
										onClick={() => handleDeleteTask(item.id)}
										size={24}
										color="#ea3140"
									/>
									<ToastContainer />
								</button>
							</div>
						</article>
					))}
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
		props: {
			user: {
				email: session?.user?.email,
			},
		},
	};
};
