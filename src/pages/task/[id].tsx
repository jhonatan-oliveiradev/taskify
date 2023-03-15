import { useState, ChangeEvent, FormEvent } from "react";
import { GetServerSideProps } from "next";
import { Textarea } from "@/components/Textarea";
import { useSession } from "next-auth/react";
import {
	doc,
	collection,
	query,
	where,
	getDoc,
	addDoc,
	getDocs,
	deleteDoc,
} from "firebase/firestore";
import db from "../../services/firebaseConnection";
import Head from "next/head";

import styles from "./styles.module.css";
import { HiTrash } from "react-icons/hi";
import { toast } from "react-toastify";

interface TaskProps {
	item: {
		task: string;
		created: string;
		public: boolean;
		user: string;
		taskId: string;
	};
	allComments: CommentProps[];
}

interface CommentProps {
	id: string;
	comment: string;
	taskId: string;
	user: string;
	name: string;
}

export default function Task({ item, allComments }: TaskProps) {
	const { data: session } = useSession();
	const [input, setInput] = useState("");
	const [comments, setComments] = useState<CommentProps[]>(allComments || []);

	async function handleComment(e: FormEvent) {
		e.preventDefault();

		if (input === "") return;

		if (!session?.user?.email || !session?.user?.name) return;

		try {
			const docRef = await addDoc(collection(db, "comments"), {
				comment: input,
				created: new Date(),
				user: session?.user?.email,
				name: session?.user?.name,
				task: item?.taskId,
			});

			const data = {
				id: docRef.id,
				comment: input,
				user: session?.user?.email,
				name: session?.user?.name,
				taskId: item?.taskId,
			};

			setComments((oldItems) => [...oldItems, data]);
			setInput("");
		} catch (err) {
			console.log(err);
		}
	}

	async function handleDeleteComment(id: string) {
		try {
			const docRef = doc(db, "comments", id);
			await deleteDoc(docRef);

			const deleteComment = comments.filter((item) => item.id !== id);
			setComments(deleteComment);

			toast.success("Comentário excluído!", {
				position: toast.POSITION.BOTTOM_RIGHT,
				className: styles.toastMessage,
			});
		} catch (err) {
			console.log(err);
		}
	}

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
				<form onSubmit={handleComment}>
					<Textarea
						value={input}
						onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
							setInput(e.target.value)
						}
						placeholder="Digite seu comentário..."
					/>
					<button className={styles.button} disabled={!session?.user}>
						Enviar comentário
					</button>
				</form>
			</section>

			<section className={styles.commentsContainer}>
				<h2>Comentários</h2>
				{comments.length === 0 && (
					<p>
						Essa tarefa ainda não teve nenhum comentário. Que tal deixar o
						primeiro?
					</p>
				)}

				{comments.map((item) => (
					<article key={item.id} className={styles.comment}>
						<div className={styles.Comment}>
							<label className={styles.commentsLabel}>{item.name}</label>
							{item.user === session?.user?.email && (
								<button className={styles.buttonTrash}>
									<HiTrash
										size={18}
										color="#ea3140"
										onClick={() => handleDeleteComment(item.id)}
									/>
								</button>
							)}
						</div>
						<p>{item.comment}</p>
					</article>
				))}
			</section>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const id = params?.id as string;
	const docRef = doc(db, "tasks", id);

	const q = query(collection(db, "comments"), where("taskId", "==", id));
	const snapshotComments = await getDocs(q);

	let allComments: CommentProps[] = [];
	snapshotComments.forEach((doc) => {
		allComments.push({
			id: doc.id,
			comment: doc.data().comment,
			user: doc.data().user,
			name: doc.data().name,
			taskId: doc.data().task,
		});
	});

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
		created: new Date(milliseconds).toLocaleDateString(),
		user: snapshot.data()?.user,
		taskId: snapshot.id,
	};

	return {
		props: {
			item: task,
			allComments: allComments,
		},
	};
};
