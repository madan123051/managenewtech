import { redirect } from 'next/navigation';

export default function NewWorkerPage() {
  redirect('/users?create=worker');
}
