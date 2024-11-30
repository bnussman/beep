import styles from "./page.module.css";
import { trpc } from "@/utils/trpc";

export default async function Home() {
  const t = await trpc.user.me.query();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        Hello {t.first}
      </main>
    </div>
  );
}
