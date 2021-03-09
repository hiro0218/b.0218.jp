import Link from "next/link";

const TheFooter = () => {
  return (
    <footer>
      <ul>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/archive">Archive</Link>
        </li>
      </ul>
    </footer>
  );
};

export default TheFooter;
