import { redirect } from 'next/navigation';

export default function NewManagerPage() {
  redirect('/users?create=manager');
}
